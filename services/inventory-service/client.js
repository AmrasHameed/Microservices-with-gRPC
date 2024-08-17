const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoPath = path.join(__dirname, 'proto/inventory.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const inventoryProto = grpc.loadPackageDefinition(packageDefinition).inventory;

const client = new inventoryProto.InventoryService('localhost:50053', grpc.credentials.createInsecure());

module.exports = client;
