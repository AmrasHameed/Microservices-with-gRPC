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

const orders = {}; 
let currentOrderId = 1; 

const createOrder = (call, callback) => {
    const { userId, productId, quantity } = call.request;
    const orderId = String(currentOrderId++); 
    orders[orderId] = {orderId, userId, productId, quantity };
    console.log(`Created order: ${orderId} ->`, orders[orderId]); 
    callback(null, { orderId });
};

const getOrder = (call, callback) => {
    const order = orders[call.request.orderId]; 
    if (order) {
        console.log(`Fetched order: ${call.request.orderId} ->`, order);
        callback(null, order);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: 'Order not found',
        });
    }
};

const server = new grpc.Server();
server.addService(orderProto.OrderService.service, { createOrder, getOrder });

const PORT = '50052';
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Failed to bind server: ${error.message}`);
    return;
  }
  console.log(`Order service running at http://localhost:${port}`);
});
