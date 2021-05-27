#!/bin/sh

git fetch alexseik
git checkout production
git pull --recurse-submodules

if [ -z `docker-compose ps -q $1` ] || [ -z `docker ps -q --no-trunc | grep $(docker-compose ps -q $1)` ]; then
  echo "No, it's not running."
  docker-compose -f docker-compose.prod.yml up --build strapi
else
  echo "Yes, it's running."
  docker-compose -f docker-compose.prod.yml restart strapi
fi

# End