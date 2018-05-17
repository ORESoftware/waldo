#!/usr/bin/env bash

set -e;

if [[ "$waldo_skip_postinstall" == "yes" ]]; then
   echo "waldo is skipping postinstall routine.";
   exit 0;
fi

export waldo_skip_postinstall="yes";

waldo_exec="@oresoftware/waldo";
ores_home="$HOME/.oresoftware";


if [[ "$oresoftware_local_dev" == "yes" ]]; then
     waldo_exec=".";  # current working directory should be project root
fi

waldo_gray='\033[1;30m'
waldo_magenta='\033[1;35m'
waldo_cyan='\033[1;36m'
waldo_orange='\033[1;33m'
waldo_green='\033[1;32m'
waldo_no_color='\033[0m'


mkdir -p "$ores_home" && {

  (
    echo "reading shell.sh file from Github...";
    curl -H 'Cache-Control: no-cache' \
    "https://cdn.rawgit.com/ORESoftware/shell/a49dc374/shell.sh?$(date +%s)" \
    --output "$ores_home/shell.sh" 2> /dev/null && {
          echo "Done writing shell.sh.";
     } || {
           echo "curl command failed to read shell.sh, now we should try wget..."
    }
  ) &

} || {

  echo "could not create dir '$ores_home'";
  exit 1;

}



mkdir -p "$ores_home/bash" && {
    echo "copying waldo.sh file from codebase to user home...";
    cat waldo.sh > "$ores_home/bash/waldo.sh" || {
      echo "could not copy waldo.sh shell file to user home." >&2;
    }
} || {

 echo "could not create bash directory in $ores_home.";

}


mkdir -p "$ores_home/execs" && {
   echo "Created execs dir in user home."
} || {
    echo "could not create 'execs' directory in '$ores_home'.";
}


mkdir -p "$ores_home/nodejs/node_modules" && {


   [ ! -f "$ores_home/nodejs/package.json" ]  && {

        echo "Creating file: $ores_home/nodejs/package.json."
        curl -H 'Cache-Control: no-cache' \
          "https://cdn.rawgit.com/ORESoftware/shell/a49dc374/assets/package.json?$(date +%s)" \
            --output "$ores_home/nodejs/package.json" 2> /dev/null || {
            echo "curl command failed to read package.json, now we should try wget..." >&2
      }
    } || {

       echo "'$ores_home/nodejs/package.json' already exists."
    }
    (
      cd "$ores_home/nodejs";
      npm install "$waldo_exec"
    )


} || {
   echo "could not create 'nodejs' directory in '$ores_home'.";
}

wait;


if [[ -z "$(which waldo)" ]]; then
    echo "installing waldo globally...."
    npm install -g "$waldo_exec"
fi


#npm_root="$(npm root -g)";
#ln -sf "$PWD" "$npm_root/waldo" || echo "waldo folder already exists globally"
#ln -sf "$(npm bin -g)/waldo" "$npm_root/waldo/dist/cli.js" || echo "waldo already installed globally";


echo -e "${waldo_green}Waldo was installed successfully.${waldo_no_color}";
echo -e "Add the following line to your .bashrc/.bash_profile files:";
echo -e "${waldo_cyan}. \"\$HOME/.oresoftware/bash/waldo.sh\"${waldo_no_color}";
