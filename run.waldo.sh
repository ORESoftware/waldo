#!/usr/bin/env bash


if [[ -n "$(command -v waldo)" ]]; then

  command waldo "$@"

else

  "$HOME/.oresoftware/nodejs/node_modules/waldo/index.sh"

fi

