FROM node:18

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

COPY index.js ./

RUN npm install

EXPOSE 5683

CMD [ "node", "index.js" ]