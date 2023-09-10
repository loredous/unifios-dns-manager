#!/bin/bash

# Configuration
#### DEPLOYMENT ####
# Should we check for new versions each time the script is run?
export UPDATE="1"

# Which level of release should auto-update use. Options are: STABLE PRERELEASE MAIN
# STABLE - Confirmed stable releases
# PRERELEASE - Early release candidates. May not always be fully stable or tested
# MAIN - Bleeding edge releases following the main branch. This should be used mostly for development, as these will be untested
export STREAM="PRERELEASE"

#### API ####

# The address where the API will be reachable (Should be the primary address of your Unifi device)
export API_HOST_ADDRESS="192.168.0.1"

# The port where the API will be reachable (Shouldn't need to change this unless you already have something on this port)
export API_PORT="5301"

# The listen address of then API
# export API_LISTEN_ADDRESS="0.0.0.0"

# The connection string of the database where persistent data should be stored.
# export DB_CONNECTION_STRING="sqlite:///dnsmanager.db"

# The configuration file to use for dnsmasq configuration
# export DNS_CONFIG_FILE="/run/dnsmasq.conf.d/99-unifios-dns-manager.conf"

# How often should the DNS manager confirm the contents of the configuration (in seconds)
# export DNS_REFRESH_INTERVAL="300"

# The PID file for dnsmasq
# export DNSMASQ_PID_FILE="/run/dnsmasq.pid"

#### WEBUI ####

# The port where the web UI will be reachable (Shouldn't need to change this unless you already have something on this port)
export WEBUI_PORT="5300"

# Auto Updater
if [ $UPDATE = 1 ]
then
echo "Beginning auto-update process with stream ${STREAM}"
    if [ $STREAM = "MAIN" ]
    then
        export RELEASE_URL = "https://github.com/loredous/unifios-dns-manager/archive/refs/heads/main.zip"
    elif [ $STREAM = "PRERELEASE" ]
    then
        export RELEASE_URL = $(curl -s "https://api.github.com/repos/loredous/unifios-dns-manager/releases" | jq ".[0].zipball_url")
    else
        export RELEASE_URL = $(curl -s "https://api.github.com/repos/loredous/unifios-dns-manager/releases" | jq "[.[] | select(.prerelease == false) | .zipball_url] | .[0]")
    fi

    wget -O unifios_dns_manager.zip ${RELEASE_URL}


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