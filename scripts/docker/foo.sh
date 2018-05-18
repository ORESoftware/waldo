#!/usr/bin/env bash

set -e;

#docker network rm foo || echo "no network";
docker network create "foo" || echo "network already exists??"


#docker stop npm_registry_server || echo "no container to stop."
#docker rm npm_registry_server  || echo "no container to remove."
#docker build -t npm_registry_server -f Dockerfile.server .
#docker run -d -v "$HOME":/host_user_home/:ro --net="foo" -it --name npm_registry_server npm_registry_server


docker stop npm_registry || echo "no container to stop."
docker rm npm_registry  || echo "no container to remove."
docker build -t npm_registry .
docker run -v "$HOME":/host_user_home:ro -it --name npm_registry npm_registry
