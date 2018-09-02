#!/usr/bin/env node
'use strict';

import path = require('path');
import {getCleanTrace} from "clean-trace";
import {CliOptions, options} from "./cli-options";

const dashdash = require('dashdash');
import {WaldoSearch} from "./index";
import chalk from "chalk";
import * as util from "util";
import {flattenDeep, getUniqueList} from './utils';

const root = process.cwd();
const parser = dashdash.createParser({options});

try {
  var opts = <CliOptions>parser.parse(process.argv);
} catch (e) {
  console.error('waldo: error:', e.message);
  process.exit(1);
}


const paths = flattenDeep([opts.path])
.map(v => String(v || '').trim())
.filter(Boolean)
.map(v => path.isAbsolute(v) ? v : path.resolve(root + '/' + v));

if (paths.length < 1) {
  paths.push(root);
}

if (opts._args && opts._args.length > 0) {
  process.once('exit', function () {
    console.error(chalk.red(
      'You have an argument (probably a trailing argument) that is in vain =>',
      chalk.red.bold(util.inspect(opts._args))
    ));
  });
}

const getRegexList = (v: Array<string>): Array<string> => {
  return getUniqueList(flattenDeep([v])
  .map(v => String(v || '').trim())
  .filter(Boolean)
  .map((v: string) => new RegExp(v)));
};

const matchesAnyOf = getRegexList(opts.match);
const matchesNoneOf = getRegexList(opts.not_match);
const matchesAllOf = getRegexList(opts.must_match);

new WaldoSearch({
  printAbsolutePaths: Boolean(opts.absolute),
  paths: getUniqueList(paths),
  matchesAnyOf,
  matchesAllOf,
  matchesNoneOf,
  isViaCLI: true,
  dirs: Boolean(opts.dirs),
  files: Boolean(opts.files)
})
.search((err: any, {warningsCount}) => {
  
  if (warningsCount > 0) {
    console.error(`Finished searching with ${warningsCount} warning(s).`)
  }
  
  if (err) {
    throw getCleanTrace(err);
  }
  
});



