#!/usr/bin/env bash


waldo(){

   if [[ -z "$(command -v waldo)" ]]; then
       npm install -g "@oresoftware/waldo" || {
         return 1;
      }
   fi

   command waldo "$@"
}


export -f waldo;


