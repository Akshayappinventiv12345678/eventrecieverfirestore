const express = require('express');
const { simulateOrders, getOngoingorders } = require('./generator');
const serversimulateOrders = require('./servergenerator');

const app = express();
const defaultOrderId = "kfc_official_structure_default";

// Utility function to handle order generation
function handleOrderGeneration(orderId, generatorFunction, res) {
  if (getOngoingorders().indexOf(orderId) === -1) {
    generatorFunction(orderId);
    res.status(201).send({ message: `Order generated successfully`, orderId });
  } else {
    res.status(409).send({ message: `Order ID already in use`, orderId });
  }
}

// Endpoint: Generate default or specific order
app.get(['/generate', '/generate/:orderId'], (req, res) => {
  const orderId = req.params.orderId || defaultOrderId;
  handleOrderGeneration(orderId, simulateOrders, res);
});

// Endpoint: Server generate default or specific order
app.get(['/servergenerate', '/servergenerate/:orderId'], (req, res) => {
  const orderId = req.params.orderId || defaultOrderId;
  handleOrderGeneration(orderId, serversimulateOrders, res);
});
