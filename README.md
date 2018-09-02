

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
waldo  ### lists all matching files and dirs in the current working dir
```
(Note that if you omit the --path arg, it defaults to `$PWD.`)

<br>

```bash
waldo --path="."  ### lists all matching files and dirs, in the current working dir
```

```bash
waldo --path="src" --path="test"  ### lists all matching files and dirs, in the src and test dirs
```

```bash
waldo --path="." --dirs  ### will not list dirs, -d for short
```

```bash
waldo --path="." --files  ### will not list files, -f for short
```

```bash
waldo --path="." --symlinks  ### will not list symlinks, -s for short
```

```bash
waldo --path="." --follow-symlinks  ### will use stat instead of lstat
```

##### Using matching

Waldo uses JavaScript regular expressions internally for matching.

```bash
waldo --path="." -n /node_modules/   # don't match any path that has /node_modules/ in it

waldo --path="." -n ^/node_modules/   # don't match any path that starts with /node_modules/ 

waldo --path="." -n /^node_modules/   # don't match any path that starts with node_modules

waldo --path="." -n '\.js$'   # don't match any path ends that with '.js'

waldo --path="." -m '\.js$'   #  match only paths that end that with '.js'
```


# Library Usage

```js

import {WaldoSearch} from 'waldo';

new WaldoSearch({
  
  path,  // the path you which to search
  matchesAnyOf,  // array of strings or RegExp
  matchesNoneOf, // array of strings or RegExp
  dirs,   // list dirs
  files   // list files (true by default)
  
})
.search((err, v) => {

    // v.results is your array of paths/strings
    // v.warnings is an array of Errors (permissions errors)

});


```

### to use with ES6 Promises

##### => Use the searchp() method

```js
new WaldoSearch({...}).searchp().then(v => {

   // v.results is your array of paths/strings
   // v.warnings is an array of Errors (permissions errors)
   
});

```

