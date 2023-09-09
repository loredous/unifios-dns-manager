FROM nikolaik/python-nodejs:python3.11-nodejs20-slim

COPY dns-manager-frontend/ /code/webui/

WORKDIR /code/webui/
RUN npm install

COPY dns-manager-backend/ /code/api/

WORKDIR /code/api/
RUN pip install -r requirements.txt

WORKDIR /
COPY dockerinit.sh /code/

EXPOSE 8000
EXPOSE 4200

RUN mkdir /dnsmasqconf; mkdir /hostrun; mkdir /conf;

cmd /code/dockerinit.sh