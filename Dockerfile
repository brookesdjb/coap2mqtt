# FROM node:18



ARG BUILD_FROM

FROM $BUILD_FROM

# Install requirements for add-on
RUN \
  apk add --no-cache \
    nodejs \
    npm

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./
COPY index.js ./

RUN npm install

EXPOSE 5683

CMD ["node", "index.js"]