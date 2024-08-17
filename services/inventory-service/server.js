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

const items = {}; 
let currentId = 1;
const addItem = (call, callback) => {
  const { name, quantity, price } = call.request;
  const itemId = String(currentId++); 
  items[itemId] = { itemId, name, quantity, price }; 
  callback(null, { itemId }); 
};

const getItem = (call, callback) => {
  const item = items[call.request.itemId];
  if (item) {
    callback(null, item);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'Item not found',
    });
  }
};

const server = new grpc.Server();
server.addService(inventoryProto.InventoryService.service, { addItem, getItem });

const PORT = '50053';
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Failed to bind server: ${error.message}`);
    return;
  }
  console.log(`Inventory service running at http://localhost:${port}`); 
});
