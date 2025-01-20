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
    
WORKDIR /data

COPY package*.json /data/

COPY index.js /data/

RUN npm install

EXPOSE 5683

CMD [ "node", "index.js" ]