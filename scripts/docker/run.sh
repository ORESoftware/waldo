#!/usr/bin/env bash

docker stop waldo;
docker rm waldo
docker build -t waldo .
docker run -it --name waldo waldo
