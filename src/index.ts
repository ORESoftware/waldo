'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import chalk from 'chalk';
import {Readable, Transform} from "stream";
import * as assert from 'assert';
import {flattenDeep, getUniqueList, SearchResult, WaldoOpts} from './utils';

export const r2gSmokeTest =  () => {
  return true;
};

export type EVCb<T> = (err: any, val?: T) => void;
export type SearchQueueTask = (cb: EVCb<any>) => void;

export class WaldoSearch {
  
  printAbsolutePaths = false;
  
  matchesNoneRegex: Array<RegExp>;
  matchesAnyRegex: Array<RegExp>;
  matchesAllRegex: Array<RegExp>;
  
  fileMatchesNoneRegex: Array<RegExp>;
  fileMatchesAnyRegex: Array<RegExp>;
  fileMatchesAllRegex: Array<RegExp>;
  
  dirMatchesNoneRegex: Array<RegExp>;
  dirMatchesAnyRegex: Array<RegExp>;
  dirMatchesAllRegex: Array<RegExp>;
  
  isViaCLI = false;
  paths: Array<string>;
  showFiles: boolean;
  showDirs: boolean;
  transform: (chunk: Buffer, enc: string, cb: Function) => void;
  queue = async.queue<SearchQueueTask, any>((task, cb) => task(cb), 5);
  depth: number;
  
  constructor(pth: WaldoOpts | string | Array<string>, opts?: WaldoOpts) {
    
    if (pth && typeof pth === 'object') {
      opts = pth as WaldoOpts;
      this.paths = getUniqueList(this.getFlattenedPath([opts.path, opts.paths]));
    }
    else {
      this.paths = getUniqueList(this.getFlattenedPath([pth as string]));
    }
    
    this.paths.forEach(v => {
      if (!path.isAbsolute(v)) {
        throw 'You must pass an absolute path to search using Waldo. The following path was not absolute: ' + v;
      }
    });
    
    opts = opts || {} as WaldoOpts;
    
    this.depth = opts.depth || Number.MAX_SAFE_INTEGER;
    assert(Number.isInteger(this.depth), '"depth" option must be an integer.');
    
    this.isViaCLI = opts.isViaCLI;
    
    this.printAbsolutePaths = opts.printAbsolutePaths === true;
    
    this.matchesAnyRegex = this.getRegexMap([opts.matchesAnyOf]);
    this.matchesNoneRegex = this.getRegexMap([opts.matchesNoneOf]);
    this.matchesAllRegex = this.getRegexMap([opts.matchesAllOf]);
    
    this.fileMatchesAnyRegex = this.getRegexMap([opts.fileMatchesAnyOf]);
    this.fileMatchesNoneRegex = this.getRegexMap([opts.fileMatchesNoneOf]);
    this.fileMatchesAllRegex = this.getRegexMap([opts.fileMatchesAllOf]);
    
    this.dirMatchesAnyRegex = this.getRegexMap([opts.dirMatchesAnyOf]);
    this.dirMatchesNoneRegex = this.getRegexMap([opts.dirMatchesNoneOf]);
    this.dirMatchesAllRegex = this.getRegexMap([opts.dirMatchesAllOf]);
    
    this.showDirs = opts.dirs !== true;
    this.showFiles = opts.files !== true;
    
  }
  
  private getRegexMap(a: Array<string | RegExp | Array<string | RegExp>>): Array<RegExp> {
    return flattenDeep([a])
    .map(v => typeof v === 'string' ? String(v || '').trim() : v)
    .filter(Boolean)
    .map(v => (v instanceof RegExp) ? v : new RegExp(v));
  }
  
  private getFlattenedPath(pth: Array<string | Array<string>>): Array<string> {
    return flattenDeep(pth).map(v => String(v || '').trim()).filter(Boolean)
  }
  
  private matchesAll(p: string) {
    
    if (this.matchesAllRegex.length < 1) {
      return false;
    }
    
    return !this.matchesAllRegex.every((r: RegExp) => {
      return r.test(p);
      
      if (r.test(p)) {
        console.log(p, 'matched:', r);
        return true;
      }
      else {
        console.log(p, 'did not match:', r);
      }
    });
  }
  
  private matchesAny(p: string) {
    
    if (this.matchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.matchesAnyRegex.some((r: RegExp) => {
      return r.test(p);
      
      if (r.test(p)) {
        console.log(p, 'matched:', r);
        return true;
      }
      else {
        console.log(p, 'did not match:', r);
      }
    });
  }
  
  private matchesNone(p: string) {
    
    if (this.matchesNoneRegex.length < 1) {
      return false;
    }
    
    return this.matchesNoneRegex.some((r: RegExp) => {
      return r.test(p);
      
      if (r.test(p)) {
        console.log(p, 'matched:', r);
        return true;
      }
      else {
        console.log(p, 'did not match:', r);
      }
    });
  }
  
  private fileMatchesNone(p: string) {
    
    if (this.fileMatchesNoneRegex.length < 1) {
      return false;
    }
    
    return this.fileMatchesNoneRegex.some((r: RegExp) => {
      return r.test(p);
    });
    
  }
  
  private fileMatchesAny(p: string) {
    
    if (this.fileMatchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.fileMatchesAnyRegex.some((r: RegExp) => {
      return r.test(p);
    });
    
  }
  
  private fileMatchesAll(p: string) {
    
    if (this.fileMatchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.fileMatchesAnyRegex.every((r: RegExp) => {
      return r.test(p);
    });
    
  }
  
  private dirMatchesNone(p: string) {
    
    if (this.fileMatchesNoneRegex.length < 1) {
      return false;
    }
    
    return this.dirMatchesNoneRegex.some((r: RegExp) => {
      return r.test(p);
    });
    
  }
  
  private dirMatchesAny(p: string) {
    
    if (this.dirMatchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.dirMatchesAnyRegex.some((r: RegExp) => {
      return r.test(p);
    });
    
  }
  
  private dirMatchesAll(p: string) {
    
    if (this.dirMatchesAnyRegex.length < 1) {
      return false;
    }
    
    return !this.dirMatchesAnyRegex.every((r: RegExp) => {
      return r.test(p);
    });
    
  }
  
  private dirMatches(p: string) {
    return this.dirMatchesAll(p) || this.dirMatchesAny(p) || this.dirMatchesNone(p);
  }
  
  private fileMatches(p: string) {
    return this.fileMatchesAll(p) || this.fileMatchesAny(p) || this.fileMatchesNone(p);
  }
  
  searchp(): Promise<SearchResult> {
    return new Promise((resolve, reject) => {
      const results: Array<string> = [];
      this._searchDirs(results, null, this.paths, (err, {warnings, warningsCount}) => {
        err ? reject(err) : resolve({results, warningsCount, warnings});
      });
    });
  }
  
  search(cb: EVCb<SearchResult>) {
    
    if (this.isViaCLI) {
      this._searchDirs(null, null, this.paths, cb);
      return;
    }
    
    const results: Array<string> = [];
    this._searchDirs(results, null, this.paths, (err, {warnings, warningsCount}) => {
      cb(err, {results, warnings, warningsCount});
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
    this._searchDirs(null, r, this.paths, (err) => {
      err ? r.emit('error', err) : r.emit('end');
    });
    return r;
  }
  
  private _searchDirs(results: Array<string>, t: Transform, dirs: Array<string>, cb: EVCb<{ warnings: Array<Error>, warningsCount: number }>) {
    
    let warningsCount = 0;
    const warnings: Array<Error> = [];
    const cwd = process.cwd();
    
    const log = (v: string) => {
      
      if (!this.printAbsolutePaths) {
        v = './' + path.relative(cwd, v);
      }
      
      if (this.isViaCLI) {
        console.log(v)
      }
      
      if (results) {
        results.push(v);
      }
      
      if (t) {
        t.write(v);
      }
    };
    
    const search = (dir: string, cb: EVCb<any>): void => {
      
      this.queue.push(callback => {
        
        fs.readdir(dir, (err, items) => {
          
          callback(null);
          
          if (err) {
            console.error(chalk.magenta(err.message));
            warningsCount++;
            if (!this.isViaCLI) {
              warnings.push(err);
            }
            return cb(null);
          }
          
          const filteredItems = items.filter(v => {
            v = path.relative(cwd, path.resolve(dir + '/' + v));
            return !(this.matchesAny(v) || this.matchesNone(v) || this.matchesAll(v));
          })
          .map(v => path.resolve(dir + '/' + v));
          
          if (filteredItems.length < 1) {
            return cb(null);
          }
          
          async.eachLimit(filteredItems, 8, (v, cb) => {
            
            fs.lstat(v, (err, stats) => {
              
              if (err) {
                console.error(chalk.magenta(err.message));
                warningsCount++;
                if (!this.isViaCLI) {
                  warnings.push(err);
                }
                return cb(null);
              }
              
              if (!stats.isDirectory()) {
                if (this.showFiles && !this.fileMatches(v)) {
                  log(v);
                }
                return cb(null);
              }
              
              
              const vRelative = path.relative(cwd, v);
              
              if (this.dirMatches(vRelative) || this.dirMatches(vRelative + '/')) {
                return cb(null);
              }
  
              if (this.showDirs) {
                log(v);
              }
              
              // if (this.matchesAny(vRelative + '/') || this.matchesNone(vRelative + '/') || this.matchesAll(vRelative + '/')) {
              //   return cb(null);
              // }
              
              search(v, cb);
              
            });
            
          }, cb);
          
        });
        
      });
      
    };
    
    async.mapLimit(dirs, 5, search, err => {
      process.nextTick(cb, err, {warningsCount, warnings});
    });
    
  };
  
}
