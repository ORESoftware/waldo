#!/usr/bin/env node
'use strict';

import async = require('async');
import path = require('path');
import fs = require('fs');
import {getCleanTrace} from "clean-trace";
import {ErrorCallback} from "async";
import {options} from "./cli-options";
const dashdash = require('dashdash');
import {WaldoSearch} from "./index";

let root = process.cwd();
const parser = dashdash.createParser({options});

try {
  var opts = parser.parse(process.argv);
} catch (e) {
  console.error('waldo: error:', e.message);
  process.exit(1);
}

if (opts.path) {
  if (path.isAbsolute(opts.path)) {
    root = opts.path;
  }
  else {
    root = path.resolve(root + '/' + opts.path);
  }
}

const matchesAnyOf = opts.match.map((v: string) => new RegExp(v));
const matchesNoneOf = opts.not_match.map((v: string) => new RegExp(v));

new WaldoSearch({
  
  path: root,
  matchesAnyOf,
  matchesNoneOf,
  isViaCLI: true
  
})
.search(function (err) {
  if (err) {
    throw getCleanTrace(err);
  }
});



