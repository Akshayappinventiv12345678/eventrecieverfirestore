const express = require('express');
const bodyParser = require('body-parser');
const { firestore } = require('./static/firestore');
const publishData=require("./static/service")

const { doc,setDoc,updateDoc,addDoc ,collection, or} = require('@firebase/firestore');
const simulateOrders = require('./generator');
const serversimulateOrders = require('./servergenerator');
const { getOngoingorders } = require('./static/activeorders');

require('dotenv').config();

const app = express();
const defaultOrderId="kfc_official_structure_dynamic";
app.use(bodyParser.json());



//  ridertracking api
app.post('/ridertracking/:brand', async (req, res) => {
  const { brand } = req.params;
  const data = req.body;
   
   publishData(brand,data).then(msg=>res.status(200).send(msg)) .catch(err=>res.status(400).send(err))


  
});




// app.get('/generate', async (req, res) => {
//   // const { brand, orderId } = req.params;
//   let orderId="kfc_official_structure_default"
//     simulateOrders(orderId);
//     res.send("Generated")
// });

// app.get('/generate/:orderId', async (req, res) => {
//   const { brand, orderId } = req.params;
//   if(orderId){
//     simulateOrders(orderId);
//   }
//   else{
//     simulateOrders("kfc_official_structure_dynamic");
//   }
  
//   res.send(" Dynamic Generated")
// });


// app.get('/servergenerate', async (req, res) => {
//   // const { brand, orderId } = req.params;
//   let orderId="kfc_official_structure_default"
//   serversimulateOrders(orderId);
//   res.send("Generated")
// });

// app.get('/servergenerate/:orderId', async (req, res) => {
//   const { brand, orderId } = req.params;
//   if(orderId){
//     serversimulateOrders(orderId);
//   }
//   else{
//     serversimulateOrders("kfc_official_structure_dynamic");
//   }
  
//   res.send(" Dynamic Generated")
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});


// Utility function to handle order generation
function handleOrderGeneration(orderId, generatorFunction, res,isServerOrder) {
  if (getOngoingorders(isServerOrder).indexOf(orderId) === -1) {
    generatorFunction(orderId);
    res.status(201).send({ message: `Order generated successfully`, orderId });
  } else {
    res.status(409).send({ message: `Order ID already in use`, orderId });
  }
}

// Endpoint: Generate default or specific order
app.get(['/generate', '/generate/:orderId'], (req, res) => {
  const orderId = req.params.orderId || defaultOrderId;
  handleOrderGeneration(orderId, simulateOrders, res,false);
});

// Endpoint: Server generate default or specific order
app.get(['/servergenerate', '/servergenerate/:orderId'], (req, res) => {
  const orderId = req.params.orderId || defaultOrderId;
  handleOrderGeneration(orderId, serversimulateOrders, res,true);
});
