#!/usr/bin/env node
'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import {getCleanTrace} from "clean-trace";
import {ErrorCallback} from "async";
import {options} from "./cli-options";
const dashdash = require('dashdash');

let root = process.cwd();

if (process.argv[2]) {
  if (path.isAbsolute(process.argv[2])) {
    root = String(process.argv[2]).trim();
  }
  else {
    root = path.resolve(root + '/' + String(process.argv[2]).trim());
  }
}

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
  
  if (matchesAnyRegex.length < 1) {
    return false;
  }
  
  return !matchesAnyRegex.some(function (r: RegExp) {
    return r.test(p);
  })
};

const matchesNone = function (p: string) {
  
  if (matchesNoneRegex.length < 1) {
    return false;
  }
  
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


