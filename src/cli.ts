#!/usr/bin/env node
'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import {getCleanTrace} from "clean-trace";
import {ErrorCallback} from "async";
import {options} from "./cli-options";
const dashdash = require('dashdash');

const root = process.cwd();
const parser = dashdash.createParser({options});

try {
  var opts = parser.parse(process.argv);
} catch (e) {
  console.error('waldo: error:', e.message);
  process.exit(1);
}

const matchesAnyRegex = opts.match.map((v: string) => new RegExp(v));
const matchesNoneRegex = opts.not_match.map((v: string) => new RegExp(v));

const matchesAny = function (p: string) {
  return !matchesAnyRegex.some(function (r: RegExp) {
    return r.test(p);
  })
};

const matchesNone = function (p: string) {
  return matchesNoneRegex.some(function (r: RegExp) {
    return r.test(p);
  })
};

const searchDir = function (dir: string, cb: ErrorCallback<any>) {
  
  fs.readdir(dir, function (err, items) {
    
    if (err) {
      return cb(err);
    }
    
    async.eachLimit(items, 3, function (v, cb) {
      
      const x = path.resolve(dir + '/' + v);
      
      if (matchesAny(x + '/') || matchesNone(x + '/')) {
        return process.nextTick(cb);
      }
      
      fs.stat(x, function (err, stats) {
        
        if (err) {
          return cb(err);
        }
        
        if (stats.isFile()) {
          console.log(x);
          return cb();
        }
        
        if (stats.isSymbolicLink()) {
          console.error('waldo: symbolic links not supported:', x);
          return cb();
        }
        
        searchDir(x, cb);
        
      });
      
    }, cb);
    
  });
  
};

searchDir(root, function (err: any) {
  
  if (err) {
    throw getCleanTrace(err);
  }
  
});


