#!/usr/bin/env bash

#npm install async

set -e;

file="/host_user_home/WebstormProjects/oresoftware/shell";
npm install

modify.json package.json dependencies.@oresoftware/shell "\"file://$file\"";

r2g --keep;
