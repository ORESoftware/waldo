'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import {getCleanTrace} from "clean-trace";
import {ErrorCallback} from "async";

export const r2gSmokeTest = function () {
  return true;
};

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
    
    if (this.matchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.matchesAnyRegex.some(function (r: RegExp) {
      return r.test(p);
    })
  }
  
  matchesNone(p: string) {
    
    if (this.matchesNoneRegex.length < 1) {
      return false;
    }
    
    return this.matchesNoneRegex.some(function (r: RegExp) {
      return r.test(p);
    })
  }
  
  searchp(): Promise<Array<string>> {
    
    const self = this;
    return new Promise(function (resolve, reject) {
      
      const results: Array<string> = [];
      if (self.isViaCLI) {
        self.__searchDir(results, self.pth, function (err) {
          err ? reject(err) : resolve(results);
        });
      }
      else {
        self.__searchDir(results, self.pth, function (err) {
          err ? reject(err) : resolve(results);
        });
      }
      
    });
  }
  
  search(cb: ErrorValCallback) {
    
    if (this.isViaCLI) {
      this.__searchDir(null, this.pth, cb);
      return;
    }
    
    const results: Array<string> = [];
    this.__searchDir(results, this.pth, function (err) {
      cb(err, results);
    });
    
  }
  
  private __searchDir(results: Array<string>, dir: string, cb: ErrorCallback<any>) {
    
    const self = this;
    
    fs.readdir(dir, function (err, items) {
      
      if (err) {
        return cb(err);
      }
      
      async.eachLimit(items, 3, function (v, cb) {
        
        const x = path.resolve(dir + '/' + v);
        
        if (self.matchesAny(x) || self.matchesNone(x) || self.matchesAny(x + '/') || self.matchesNone(x + '/')) {
          return process.nextTick(cb);
        }
        
        fs.stat(x, function (err, stats) {
          
          if (err) {
            return cb(err);
          }
          
          if (stats.isFile()) {
            // write to stdout if we are using the command line
            if (self.showFiles) {
              self.isViaCLI ? console.log(x) : results.push(x);
            }
            return cb();
          }
          
          if (stats.isSymbolicLink()) {
            console.error('waldo: symbolic links not supported:', x);
            return cb();
          }
          
          if (self.showDirs) {
            self.isViaCLI ? console.log(x) : results.push(x);
          }
          
          self.__searchDir(results, x, cb);
          
        });
        
      }, cb);
      
    });
    
  };
  
}
