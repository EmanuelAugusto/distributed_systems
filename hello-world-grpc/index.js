const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const Redis = require("ioredis");
const redisDb = new Redis('redis://redis:6379');

const protoObject = protoLoader.loadSync(path.resolve(__dirname, './_proto/translations.proto'))


const TranslationDefinition = grpc.loadPackageDefinition(protoObject)

const server = new grpc.Server();

const List = async (_, callback) =>{
    const KEY = "user";

    const tranlations = JSON.parse(await redisDb.get(KEY));

    return callback(null, { tranlations })

}

server.addService(TranslationDefinition.TranslationsService.service, { List })

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
console.log('running')
server.start()