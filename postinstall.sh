#!/usr/bin/env bash

set -e;

if [[ "$waldo_skip_postinstall" == "yes" ]]; then
   echo "waldo is skipping postinstall routine.";
   exit 0;
fi

export waldo_skip_postinstall="yes";

waldo_gray='\033[1;30m'
waldo_magenta='\033[1;35m'
waldo_cyan='\033[1;36m'
waldo_orange='\033[1;33m'
waldo_green='\033[1;32m'
waldo_no_color='\033[0m'

mkdir -p "$HOME/.oresoftware/bash" && {

    cat waldo.sh > "$HOME/.oresoftware/bash/waldo.sh"

} || {
 echo "could not create bash directory in $HOME/oresoftware.";
}

mkdir -p "$HOME/.oresoftware/execs" || echo "could not create execs directory in $HOME/oresoftware.";


mkdir -p "$HOME/.oresoftware/nodejs/node_modules" && {

    (
      cd "$HOME/.oresoftware/nodejs";
      npm install @oresoftware/waldo@latest
    )

} || {
   echo "could not create 'nodejs' directory in $HOME/oresoftware.";
}



if [[ -z "$(which waldo)" ]]; then
    echo "installing waldo globally...."
    npm install -g @oresoftware/waldo
fi

#wait;


#npm_root="$(npm root -g)";
#ln -sf "$PWD" "$npm_root/waldo" || echo "waldo folder already exists globally"
#ln -sf "$(npm bin -g)/waldo" "$npm_root/waldo/dist/cli.js" || echo "waldo already installed globally";


echo -e "${waldo_green}Waldo was installed successfully.${waldo_no_color}";
echo -e "Add the following line to your .bashrc/.bash_profile files:";
echo -e "${waldo_cyan}. \"\$HOME/.waldo/waldo.sh\"${waldo_no_color}";
