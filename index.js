const express = require('express');
const userClient = require('./services/user-service/client'); 
const orderClient = require('./services/order-service/client'); 
const inventoryClient = require('./services/inventory-service/client'); 

const app = express();
const port = 8000;

app.use(express.json());

// User Service Endpoints
app.get('/getUser/:id', (req, res) => {
  const { id } = req.params;
  userClient.getUser({ id }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
});

app.post('/createUser', (req, res) => {
  const { id, name, email } = req.body;
  userClient.createUser({ id, name, email }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
});

// Order Service Endpoints
app.get('/getOrder/:orderId', (req, res) => {
  const { orderId } = req.params;
  orderClient.getOrder({ orderId }, (err, response) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(response);
  });
});

app.post('/createOrder', (req, res) => {
  const { userId, productId, quantity } = req.body;
  orderClient.createOrder({ userId, productId, quantity }, (err, response) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(response);
  });
});

// Inventory Service Endpoints
app.get('/getItem/:itemId', (req, res) => {
  const { itemId } = req.params;
  inventoryClient.getItem({ itemId }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
});

app.post('/addItem', (req, res) => {
  const { name, quantity, price } = req.body;
  inventoryClient.addItem({ name, quantity, price }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response); 
  });
});


app.listen(port, () => {
  console.log(`REST API server running at http://localhost:${port}`);
});
