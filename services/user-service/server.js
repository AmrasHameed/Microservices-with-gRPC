const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoPath = path.join(__dirname, 'proto/user.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const users = {}; 

const createUser = (call, callback) => {
  const { id, name, email } = call.request;
  users[id] = { name, email };
  callback(null, { id, name, email });
};

const getUser = (call, callback) => {
  const user = users[call.request.id];
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: 'User not found',
    });
  }
};


const server = new grpc.Server();
server.addService(userProto.UserService.service, { createUser, getUser });

const PORT = '50051';
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Failed to bind server: ${error.message}`);
    return;
  }
  console.log(`User service running at http://localhost:${port}`);
});
