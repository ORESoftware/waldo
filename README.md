

# @oresoftware/waldo

GNU/BSD `find` kills me sometimes, so I wrote this.

### install:  

```bash

# for command line tools
npm install -g waldo

# for library usage
npm install waldo --save

```

### At the command line:

##### Basic usage

```bash
waldo --path="."  ### lists all matching files (no dirs)
```

Note that if you omit the --path arg, it defaults to `$PWD/.`


```bash
waldo --path="." --dirs  ### lists just dirs, -d for short
```

```bash
waldo --path="." --dirs --files  ### lists files and dirs, -f and -d for short
```

##### Using matching

```bash
waldo --path="." -n /node_modules/   # don't match any path that has /node_modules/ in it

waldo --path="." -n ^/node_modules/   # don't match any path that starts with /node_modules/ 

waldo --path="." -n '\.js$'   # don't match any path ends that with '.js'

waldo --path="." -m '\.js$'   #  match only paths that end that with '.js'
```


# Library Usage

```js

import {WaldoSearch} from '@oresoftware/waldo';

new WaldoSearch({
  
  path: root,  // the path you which to search
  matchesAnyOf,  // array of strings or RegExp
  matchesNoneOf, // array of strings or RegExp
  dirs: opts.dirs,   // list dirs
  files: opts.files   // list files (true by default)
  
})
.search((err, results) => {

    // results is your array of strings
});


```

### to use with ES6 Promises

##### => Use the searchp() method

```js
new WaldoSearch({...}).searchp().then(results => {

    // results is your array of strings
});

```

