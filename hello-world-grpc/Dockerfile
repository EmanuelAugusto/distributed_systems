FROM --platform=linux/amd64 node:18 

WORKDIR /usr/src/grpc

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 50051


CMD [ "node", "index.js" ]