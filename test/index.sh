#!/usr/bin/env bash

#npm install async

set -e;

mkdir "/host_user_home/zagae8a3g3"

file="/host_user_home/WebstormProjects/oresoftware/shell";
npm install "$file"

modify.json package.json dependencies.@oresoftware/shell `cat <<EOF
   "file://$file"
EOF`



r2g --keep;
