const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoPath = path.join(__dirname, 'proto/order.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

const client = new orderProto.OrderService('localhost:50052', grpc.credentials.createInsecure());

module.exports = client;
