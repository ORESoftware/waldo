#!/usr/bin/env bash

set -e;

waldo_gray='\033[1;30m'
waldo_magenta='\033[1;35m'
waldo_cyan='\033[1;36m'
waldo_orange='\033[1;33m'
waldo_green='\033[1;32m'
waldo_no_color='\033[0m'


mkdir -p "$HOME/.waldo/nodejs/waldo"

#cp -r dist "$HOME/.waldo/nodejs/waldo"
#
#root_waldo="/usr/local/bin/waldo"
#rm -rf "$root_waldo" || echo "could not remove '$root_waldo'";
#cat run.waldo.sh > "$root_waldo" && chmod u+x "$root_waldo" || {
#  echo "Could not write file or change permissions for file '$root_waldo'"
#}
#
#waldo_bin="$(npm bin -g)/waldo";
#rm -rf "$waldo_bin" || echo "could not remove '$waldo_bin'";
#cat run.waldo.sh > "$waldo_bin" && chmod u+x "$waldo_bin" || {
#  echo "Could not write file or change permissions for file '$waldo_bin'"
#}

echo -e "${waldo_green}Waldo was installed successfully.${waldo_no_color}";
echo -e "Add the following line to your .bashrc/.bash_profile files:";
echo -e "${waldo_cyan}. \"\$HOME/.waldo/waldo.sh\"${waldo_no_color}";
