#!/bin/bash

# Configuration
export API_PORT="4201"
export WEBUI_PORT="4200"

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