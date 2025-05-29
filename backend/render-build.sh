#!/usr/bin/env bash
# render-build.sh

apt-get update && apt-get install -y postgresql-client

pip install -r requirements.txt
