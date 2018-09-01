'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import chalk from 'chalk';
import {Readable, Transform} from "stream";

export const r2gSmokeTest = function () {
  return true;
};

export interface Pushable {
  push(str: any): any
}

export interface WaldoOpts {
  isViaCLI?: boolean,
  dirs?: boolean,
  files?: boolean,
  symlinks?: boolean,
  path: string
  matchesAnyOf?: Array<string | RegExp>,
  matchesNoneOf?: Array<string | RegExp>
}

const flattenDeep = function (a: Array<any>): Array<any> {
  return a.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};

const regExpMap = function (v: string | RegExp) {
  return (v instanceof RegExp) ? v : new RegExp(v);
};

export type EVCb<T> = (err: any, val?: T) => void;
export type SearchQueueTask = (cb: EVCb<any>) => void;

export class WaldoSearch {
  
  matchesNoneRegex: Array<RegExp>;
  matchesAnyRegex: Array<RegExp>;
  isViaCLI = false;
  pth: string;
  showFiles: boolean;
  showDirs: boolean;
  transform: (chunk: Buffer, enc: string, cb: Function) => void;
  queue = async.queue<SearchQueueTask, any>((task, cb) => task(cb), 8);
  
  constructor(pth: string | WaldoOpts, opts?: WaldoOpts) {
    
    if (pth && typeof pth === 'object') {
      opts = pth as WaldoOpts;
      this.pth = opts.path as string;
    }
    else {
      this.pth = pth as string;
    }
    
    if (!path.isAbsolute(this.pth)) {
      throw new Error('You must pass an absolute path to search with using Waldo.');
    }
    
    opts = opts || {} as WaldoOpts;
    this.isViaCLI = opts.isViaCLI;
    
    this.matchesAnyRegex = flattenDeep([opts.matchesAnyOf]).filter(Boolean).map(regExpMap);
    this.matchesNoneRegex = flattenDeep([opts.matchesNoneOf]).filter(Boolean).map(regExpMap);
    
    this.showDirs = opts.dirs === true;
    this.showFiles = opts.files === true || opts.dirs !== true;
    
    console.log(this);
    
  }
  
  private matchesAny(p: string) {
    
    // console.log('there is regex:.', this.matchesAnyRegex);
    
    if (this.matchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.matchesAnyRegex.some((r: RegExp) => {
      return r.test(p);
    });
  }
  
  private matchesNone(p: string) {
    
    if (this.matchesNoneRegex.length < 1) {
      return false;
    }
    
    return this.matchesNoneRegex.some((r: RegExp) => {
      // console.log('testing', r, 'against', p);
      return r.test(p);
    })
  }
  
  searchp(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      const results: Array<string> = [];
      this.__searchDir(results, null, this.pth, (err) => {
        err ? reject(err) : resolve(results);
      });
    });
  }
  
  search(cb: EVCb<Array<string>>) {
    
    if (this.isViaCLI) {
      this.__searchDir(null, null, this.pth, cb);
      return;
    }
    
    const results: Array<string> = [];
    this.__searchDir(results, null, this.pth, err => {
      cb(err, results);
    });
    
  }
  
  private static __transform(chunk: Buffer | string, enc: string, cb: Function) {
    //  streams are dumb lol
    cb(String(chunk));
  }
  
  getReadableStream() {
    const r = new Transform({
      transform: this.transform || WaldoSearch.__transform
    });
    this.__searchDir(null, r, this.pth, function (err) {
      err ? r.emit('error', err) : r.emit('end');
    });
    return r;
  }
  
  private __searchDir(results: Array<string>, r: Transform, dir: string, cb: EVCb<any>) {
    
    this.queue.push(cb => {
      
      fs.readdir(dir, (err, items) => {
        
        if (err) {
          console.error(chalk.magenta(err.message));
          return cb(null);
        }
        
        if (items.length < 1) {
          return cb(null);
        }
        
        async.eachLimit(items, 5, (v, cb) => {
          
          const x = path.resolve(dir + '/' + v);
          
          if (this.matchesNone(x)) {
            return process.nextTick(cb);
          }
          
          if (this.matchesNone(x + '/')) {
            return process.nextTick(cb);
          }
          
          fs.lstat(x, (err, stats) => {
            
            if (err) {
              console.error(chalk.magenta(err.message));
              return cb(null);
            }
            
            if (!stats.isDirectory()) {
              // write to stdout if we are using the command line
              
              if (this.matchesAny(x)) {
                return cb(null);
              }
              
              if (this.matchesNone(x)) {
                return cb(null);
              }
              
              if (this.matchesNone(x + '/')) {
                return cb(null);
              }
              
              if (this.showFiles) {
                this.isViaCLI ? console.log(x) : (results ? results.push(x) : r.write(x));
              }
              
              return cb(null);
            }
            
            if (this.showDirs) {
              this.isViaCLI ? console.log(x) : (results ? results.push(x) : r.write(x));
            }
            
            this.__searchDir(results, r, x, cb);
            
          });
          
        }, cb);
        
      });
      
    }, cb);
    
  };
  
}
