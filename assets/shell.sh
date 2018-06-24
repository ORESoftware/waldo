#!/usr/bin/env bash

get_latest_source_waldo(){
  . "$HOME/.oresoftware/bash/waldo.sh"
}

waldo(){

 if ! type -f waldo &> /dev/null || ! which waldo &> /dev/null; then

       echo "Installing '@oresoftware/waldo' globally...";

       npm i -s -g '@oresoftware/waldo' || {
         echo "Could not install the '@oresoftware/waldo' package globally.";
         echo "Please check your permissions to install NPM packages globally.";
         return 1;
      }

   fi

   command waldo $@
}


export -f waldo;


