#!/usr/bin/env bash


waldo(){

    if [[ -n "$(command -v waldo)" ]]; then

      command waldo "$@"

    else

      "$HOME/.oresoftware/nodejs/node_modules/waldo/index.sh"

    fi

}



