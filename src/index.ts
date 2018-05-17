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
  dirs: boolean,
  files: boolean,
  symlinks: boolean,
  path: string
  matchesAnyOf: Array<string | RegExp>,
  matchesNoneOf: Array<string | RegExp>
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
  
  constructor(pth: string | WaldoOpts, opts: WaldoOpts) {
    
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
  
  search(cb: ErrorCallback<any>) {
    this.searchDir(this.pth, cb);
  }
  
  searchDir(dir: string, cb: ErrorCallback<any>) {
    
    const self = this;
    
    fs.readdir(dir, function (err, items) {
      
      if (err) {
        return cb(err);
      }
      
      async.eachLimit(items, 3, function (v, cb) {
        
        const x = path.resolve(dir + '/' + v);
        
        if (self.matchesAny(x + '/') || self.matchesNone(x + '/')) {
          return process.nextTick(cb);
        }
        
        fs.stat(x, function (err, stats) {
          
          if (err) {
            return cb(err);
          }
          
          if (stats.isFile()) {
            // write to stdout if we are using the command line
            self.isViaCLI && console.log(x);
            return cb();
          }
          
          if (stats.isSymbolicLink()) {
            console.error('waldo: symbolic links not supported:', x);
            return cb();
          }
          
          self.searchDir(x, cb);
          
        });
        
      }, cb);
      
    });
    
  };
  
}
