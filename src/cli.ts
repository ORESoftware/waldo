#!/usr/bin/env node
'use strict';

import path = require('path');
import {getCleanTrace} from "clean-trace";
import {options} from "./cli-options";
const dashdash = require('dashdash');
import {WaldoSearch} from "./index";
import chalk from "chalk";
import * as util from "util";

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

if (opts._args && opts._args.length > 0) {
  process.once('exit', function () {
    console.error(chalk.red(
      'You have an argument (probably a trailing argument) that is in vain =>',
      chalk.red.bold(util.inspect(opts._args))
    ));
  });
}

const matchesAnyOf = opts.match.map((v: string) => new RegExp(v));
const matchesNoneOf = opts.not_match.map((v: string) => new RegExp(v));

new WaldoSearch({
  
  path: root,
  matchesAnyOf,
  matchesNoneOf,
  isViaCLI: true,
  dirs: opts.dirs,
  files: opts.files
  
})
.search((err) => {
  
  console.log('all done...');
  
  if (err) {
    throw getCleanTrace(err);
  }
});



