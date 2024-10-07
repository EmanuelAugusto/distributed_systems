FROM --platform=linux/amd64 node:18 

WORKDIR /usr/src/auth

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3001


CMD [ "node", "index.js" ]