#!/usr/bin/env bash

all_export="yep";

if [[ ! "$SHELLOPTS" =~ "allexport" ]]; then
    all_export="nope";
    set -a;
fi



waldo_get_latest(){
  . "$BASH_SOURCE" # source this file
}

waldo(){

 if ! type -f waldo &> /dev/null || ! which waldo &> /dev/null; then

       echo "Installing 'waldo' globally...";

       npm i -s -g 'waldo' || {
         echo "Could not install the 'waldo' package globally.";
         echo "Please check your permissions to install NPM packages globally.";
         return 1;
      }

   fi

   command "$FUNCNAME" "$@"
}





if [ "$all_export" == "nope" ]; then
  set +a;
fi

