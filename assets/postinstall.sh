#!/usr/bin/env bash

set -e;

if [[ "$waldo_skip_postinstall" == "yes" ]]; then
   echo "waldo is skipping postinstall routine.";
   exit 0;
fi

export waldo_skip_postinstall="yes";
waldo_exec="@oresoftware/waldo";
ores_home="$HOME/.oresoftware";


waldo_gray='\033[1;30m'
waldo_magenta='\033[1;35m'
waldo_cyan='\033[1;36m'
waldo_orange='\033[1;33m'
waldo_green='\033[1;32m'
waldo_no_color='\033[0m'


mkdir -p "$ores_home" || {
  echo "Could not create .oresoftware dir in user home.";
  exit 1;
}

(

    cat "node_modules/@oresoftware/shell/assets/shell.sh" > "$HOME/.oresoftware/shell.sh" && {
        echo "Successfully copied @oresoftware/shell/assets/shell.sh to $HOME/.oresoftware/shell.sh";
        exit 0;
    }

    echo "Could not copy file, using Github.";
    echo "reading shell.sh file from Github...";

    curl -H 'Cache-Control: no-cache' \
        "https://raw.githubusercontent.com/oresoftware/shell/master/assets/shell.sh?$(date +%s)" \
        --output "$ores_home/shell.sh" 2> /dev/null && {

          echo "Done writing shell.sh.";
          exit 0;
     }

    echo "curl command failed to read shell.sh, now we should try wget...";
    echo "could not create dir '$ores_home'";
    exit 1;

)


mkdir -p "$ores_home/bash" || {
    echo "could not create bash directory in $ores_home.";
    exit 1;
}


echo "copying waldo.sh file from codebase to user home...";
cat assets/shell.sh > "$ores_home/bash/waldo.sh" || {
  echo "could not copy waldo.sh shell file to user home." >&2;
  exit 1;
}


mkdir -p "$ores_home/execs" && {
   echo "Created execs dir in user home."
} || {
    echo "could not create 'execs' directory in '$ores_home'.";
    exit 1;
}


 (

  mkdir -p "$ores_home/nodejs/node_modules" || {
    echo "could not create 'nodejs' directory in '$ores_home'.";
    exit 1;
  }

  if  [  -f "$ores_home/nodejs/package.json" ]; then
    echo "'$ores_home/nodejs/package.json' already exists."
    exit 0;
  fi

    cat "node_modules/@oresoftware/shell/assets/package.json" > "$ores_home/nodejs/package.json" && {
        echo "Successfully copied @oresoftware/shell/assets/package.json to $ores_home/nodejs/package.json";
        exit 0;
    }

    echo "Creating file: $ores_home/nodejs/package.json."

    curl -H 'Cache-Control: no-cache' \
      "https://raw.githubusercontent.com/oresoftware/shell/master/assets/package.json?$(date +%s)" \
        --output "$ores_home/nodejs/package.json" 2> /dev/null || {
          echo "curl command failed to read package.json, now we should try wget..." >&2
      }

 )


echo -e "${waldo_green}Waldo was installed successfully.${waldo_no_color}";
echo -e "Add the following line to your .bashrc/.bash_profile files:";
echo -e "${waldo_cyan}. \"\$HOME/.oresoftware/bash/waldo.sh\"${waldo_no_color}";
