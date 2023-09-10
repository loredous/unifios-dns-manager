#!/bin/bash

source vars.sh

# Auto Updater
if [ $UPDATE = 1 ]
then
echo "Beginning auto-update process with stream ${STREAM}"
    if [ $STREAM = "PRERELEASE" ]
    then
        export RELEASE_TAG = $(curl -s "https://api.github.com/repos/loredous/unifios-dns-manager/releases" | jq ".[0].tag_name")
    else
        export RELEASE_TAG = $(curl -s "https://api.github.com/repos/loredous/unifios-dns-manager/releases" | jq "[.[] | select(.prerelease == false) | .tag_name] | .[0]")
    fi

    wget -O release.zip https://github.com/loredous/unifios-dns-manager/releases/download/${RELEASE_TAG}/release.zip
    unzip -o release.zip
fi

# STARTING API
if [ ! -d ".venv" ] 
then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r dns-manager-backend/requirements.txt
python dns-manager-backend/api.py &
deactivate

# STARTING FRONTEND
npm install --prefix dns-manager-frontend/
PORT=${WEBUI_PORT} npm start --prefix dns-manager-frontend/