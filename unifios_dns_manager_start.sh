#!/bin/bash

if [ -f "vars.sh" ]
then
    source vars.sh
fi
# Auto Updater
if [ -z $UPDATE ]
then
echo "Beginning auto-update process with stream ${STREAM}"
    if [ -f "current_tag" ]
    then
        export CURRENT_TAG=$(cat current_tag)
    else
        export CURRENT_TAG="0.0.0"
    fi
    echo "Currently installed version is ${CURRENT_TAG}"
    if [ -z $STREAM ]; then export STREAM="STABLE"; fi
    if [ $STREAM = "PRERELEASE" ]
    then
        export RELEASE_TAG=$(curl -s "https://api.github.com/repos/loredous/unifios-dns-manager/releases" | jq -r ".[0].tag_name")
    elif [ $STREAM = "STABLE" ]
        export RELEASE_TAG=$(curl -s "https://api.github.com/repos/loredous/unifios-dns-manager/releases" | jq -r "[.[] | select(.prerelease == false) | .tag_name] | .[0]")
    fi

    if [ CURRENT_TAG != RELEASE_TAG ]
    then
        echo "Installed release does not match latest from ${STREAM}. Doing in-place upgrade."
        wget -O release.zip https://github.com/loredous/unifios-dns-manager/releases/download/${RELEASE_TAG}/release.zip
    
        if [ -f "vars.sh"]
        then
            echo "Existing install detected, not overwriting vars.sh"
            unzip -o release.zip -x vars.sh
        else
            echo "New install detected, including vars.sh with default values"
            unzip -o release.zip
            source vars.sh
        fi
    else
        echo "Latest version already installed. Not upgrading."
    fi
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