#!/usr/bin/env node
'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import {getCleanTrace} from "clean-trace";
import {ErrorCallback} from "async";

const root = process.cwd();

const matches = function (p: string) {
  return [/\/node_modules\//, /\/.git\//].some(function (r) {
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
      
      if (matches(x + '/')) {
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


