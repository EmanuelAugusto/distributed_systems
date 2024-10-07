FROM --platform=linux/amd64 node:18 

WORKDIR /usr/src/translate

COPY package*.json ./

RUN yarn

COPY . .


CMD [ "node", "index.js" ]