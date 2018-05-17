#!/usr/bin/env bash

#npm install async

set -e;

file="/host_user_home/WebstormProjects/oresoftware/shell";
npm install "$file"

modify.json package.json dependencies.@oresoftware/shell `cat <<EOF
   "file://$file"
EOF`



r2g --keep;
