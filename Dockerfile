# FROM node:18

# RUN mkdir -p /home/node/app/node_modules

# WORKDIR /home/node/app
ARG BUILD_FROM

FROM $BUILD_FROM

# Install requirements for add-on
RUN \
  apk add --no-cache \
    nodejs \
    npm

RUN mkdir -p /data
WORKDIR /data

RUN pwd

COPY package*.json /data/
COPY index.js /data/index.js

COPY package*.json /
COPY index.js /
COPY run.sh /

RUN chmod a+x /run.sh

RUN ls

RUN npm install

EXPOSE 5683

CMD ["run.sh"]