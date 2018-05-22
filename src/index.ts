'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import {getCleanTrace} from "clean-trace";
import {ErrorCallback} from "async";
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

export interface ErrorValCallback {
  (err: any, val?: Array<string>): void;
}

const flattenDeep = function (a: Array<any>): Array<any> {
  return a.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};

const regExpMap = function (v: string | RegExp) {
  return (v instanceof RegExp) ? v : new RegExp(v);
};

export class WaldoSearch {
  
  matchesNoneRegex: Array<RegExp>;
  matchesAnyRegex: Array<RegExp>;
  isViaCLI = false;
  pth: string;
  showFiles: boolean;
  showDirs: boolean;
  transform: (chunk: Buffer, enc: string, cb: Function) => void;
  
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
    
  }
  
  matchesAny(p: string) {
    
    // console.log('there is regex:.', this.matchesAnyRegex);
    
    if (this.matchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.matchesAnyRegex.some(function (r: RegExp) {
      return r.test(p);
    });
  }
  
  matchesNone(p: string) {
    
    if (this.matchesNoneRegex.length < 1) {
      return false;
    }
    
    return this.matchesNoneRegex.some(function (r: RegExp) {
      // console.log('testing', r, 'against', p);
      return r.test(p);
    })
  }
  
  searchp(): Promise<Array<string>> {
    
    const self = this;
    return new Promise(function (resolve, reject) {
      
      const results: Array<string> = [];
      if (self.isViaCLI) {
        self.__searchDir(results, null, self.pth, function (err) {
          err ? reject(err) : resolve(results);
        });
      }
      else {
        self.__searchDir(results, null, self.pth, function (err) {
          err ? reject(err) : resolve(results);
        });
      }
      
    });
  }
  
  search(cb: ErrorValCallback) {
    
    if (this.isViaCLI) {
      this.__searchDir(null, null, this.pth, cb);
      return;
    }
    
    const results: Array<string> = [];
    this.__searchDir(results, null, this.pth, function (err) {
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
  
  private __searchDir(results: Array<string>, r: Transform, dir: string, cb: ErrorCallback<any>) {
    
    const self = this;
    
    fs.readdir(dir, function (err, items) {
      
      if (err) {
        return cb(err);
      }
      
      async.eachLimit(items, 3, function (v, cb) {
        
        const x = path.resolve(dir + '/' + v);
        
        if (self.matchesNone(x)) {
          return process.nextTick(cb);
        }
        
        if (self.matchesNone(x + '/')) {
          return process.nextTick(cb);
        }
        
        fs.stat(x, function (err, stats) {
          
          if (err) {
            return cb(err);
          }
          
          if (stats.isFile()) {
            // write to stdout if we are using the command line
            
            if (self.matchesAny(x)) {
              return process.nextTick(cb);
            }
            
            if (self.matchesNone(x)) {
              return process.nextTick(cb);
            }
            
            if (self.matchesNone(x + '/')) {
              return process.nextTick(cb);
            }
            
            if (self.showFiles) {
              self.isViaCLI ? console.log(x) :
                (results ? results.push(x) : r.write(x));
            }
            return cb();
          }
          
          if (stats.isSymbolicLink()) {
            console.error('waldo: symbolic links not supported:', x);
            return cb();
          }
          
          if (self.showDirs) {
            self.isViaCLI ? console.log(x) :
              (results ? results.push(x) : r.write(x));
          }
          
          self.__searchDir(results, r, x, cb);
          
        });
        
      }, cb);
      
    });
    
  };
  
}
