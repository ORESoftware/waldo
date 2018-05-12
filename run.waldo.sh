#!/usr/bin/env bash


if [ -f "$HOME/.waldo/nodejs/waldo/dist/cli.js" ]; then
      node "$HOME/.waldo/nodejs/waldo/dist/cli.js"
else
      echo "no waldo available."
#      npm install -g waldo
#      waldo "$@"
fi

