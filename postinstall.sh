#!/usr/bin/env bash

set -e;

if [[ "$waldo_skip_postinstall" == "yes" ]]; then
   echo "waldo is skipping postinstall routine.";
   exit 0;
fi

waldo_gray='\033[1;30m'
waldo_magenta='\033[1;35m'
waldo_cyan='\033[1;36m'
waldo_orange='\033[1;33m'
waldo_green='\033[1;32m'
waldo_no_color='\033[0m'

mkdir -p "$HOME/.oresoftware/bash";
mkdir -p "$HOME/.oresoftware/execs";
mkdir -p "$HOME/.oresoftware/nodejs";

cat waldo.sh > "$HOME/.oresoftware/bash/waldo.sh"

(

  cd "$HOME/.oresoftware/nodejs";
  waldo_skip_postinstall=yes npm install @oresoftware/waldo@latest
) &


if [[ -z "$(which waldo)" ]]; then
    echo "installing waldo globally...."
    waldo_skip_postinstall=yes npm install -g @oresoftware/waldo
fi

wait;


#npm_root="$(npm root -g)";
#ln -sf "$PWD" "$npm_root/waldo" || echo "waldo folder already exists globally"
#ln -sf "$(npm bin -g)/waldo" "$npm_root/waldo/dist/cli.js" || echo "waldo already installed globally";


echo -e "${waldo_green}Waldo was installed successfully.${waldo_no_color}";
echo -e "Add the following line to your .bashrc/.bash_profile files:";
echo -e "${waldo_cyan}. \"\$HOME/.waldo/waldo.sh\"${waldo_no_color}";
