
const orders = require("./static/orders");
const publishData=require("./static/service")
const locations= require('./static/locations');
const { addOrder, removeOrder } = require("./static/activeorders");
// Mock Webhook URLs for each brand
const webhookUrls = {
  kfc: 'http://localhost:3000/webhook/kfc',
  pizzahut: 'http://localhost:3000/webhook/pizzahut',
  hardees: 'http://localhost:3000/webhook/hardees'
};

// Helper function to generate random ETA (between 15-45 minutes)
function getRandomETA() {
  return Math.floor(Math.random() * 30) + 15;  // ETA between 15 to 45 minutes
}
function getRandomTimeout() {
  return Math.floor(Math.random() * 5) + 7;  // ETA between 5 to 10 seconds
}

// Helper function to generate random rider details
function getRiderDetails() {
  const riders = [
    { name: 'John Doe', phone: '555-1234' ,id:"1"},
    { name: 'Jane Smith', phone: '555-5678',id:"2" },
    { name: 'Rick Johnson', phone: '555-9012',id:"3" }
  ];
  return riders[Math.floor(Math.random() * riders.length)];
}

// Helper function to simulate an order journey
async function simulateOrderJourney(brand, orderId, items) {
  const eta = getRandomETA();
  const rider = getRiderDetails();

  // const orderEvents = [
  //   { status: 'Order Placed', eta: eta, rider: rider, items: items },
  //   { status: 'Order Prepared', eta: eta - 10, rider: rider, items: items },
  //   { status: 'Out for Delivery', eta: eta - 5, rider: rider, items: items },
  //   { status: 'Order Delivered', eta: 0, rider: rider, items: items }
  // ];
  const orderEvents = [
    { status: 'Unassigned', code: 11, eta: 30, rider: rider, items: items ,location:locations[0]},
    { status: 'Assigned', code: 2, eta: 20, rider: rider, items: items ,location:locations[0]},
    { status: 'Seen', code: 3, eta: 20, rider: rider, items: items ,location:locations[0]},
    { status: 'Scanned', code: 4, eta: 20, rider: rider, items: items ,location:locations[0]},
    { status: 'OrderPicked', code: 7, eta: 20, rider: rider, items: items ,location:locations[0]},
    { status: 'OrderPicked', code: 12, eta: 14, rider: rider, items: items,location:locations[1] },
    { status: 'OrderPicked', code: 7, eta: 11, rider: rider, items: items ,location:locations[2]},
    { status: 'OrderPicked', code: 7, eta: 8, rider: rider, items: items ,location:locations[3]},
    { status: 'OrderPicked', code: 7, eta: 6, rider: rider, items: items,location:locations[4] },
    { status: 'OrderPicked', code: 7, eta: 4, rider: rider, items: items,location:locations[5] },
    { status: 'OrderPicked', code: 13, eta: 2, rider: rider, items: items,location:locations[6] },
    { status: 'Delivered', code: 8, eta: 0, rider: rider, items: items ,location:locations[7]}
];

let additiona_payload={
  "clubbed_order": "NO",
  "clubbed_intransit": "YES",
  "non_integrated_dod_rider": "No",
  "integrated_dod_rider": "Yes",
  "order_on_hold": "No",
  "speed": 0.72037643,
  "accuracy": 22.084,
  "heading": 101,
  "poscreatedattimezone": "2024-09-11T12:08:58Z",
  "createdattimezone": "2024-09-11T12:10:12Z",
  "planneddeliverytimezone": "2024-09-11T12:53:58Z",
  "ordersourceid": 4,
  "storebspnumber": "155c63dc78df480da008a76fde914d35",
  "countryid": 1,
  "brandid": 3,
  "storeid": "671",
  "order_posid":"POSID",
  "almporderid": "ca76858a2eb1144b265df5c4a45146a2f5b67eca"
};

  for (let i = 0; i < orderEvents.length; i++) {
    try {
      console.log(" ------Generated------ ");

      console.log(`Sending "${orderEvents[i].status}" update for ${brand}, Order ID: ${orderId}`);

      // Send event to the brand's webhook
      publishData(brand,Object.assign({}, {
        orderId: orderId,
        riderId: "13475",
        riderName: orderEvents[i].rider.name,
        riderPhone: orderEvents[i].rider.phone,
        customerName: "dima 1987",
        customerPhone: "566628897",
        order_status: orderEvents[i].status,
        almpStatusId:orderEvents[i].code,
        eta: orderEvents[i].eta,
      },orderEvents[i].location,additiona_payload)).then(msg=> console.log("----Generated----",msg)).catch(err=>console.log("----ErrorGenerated----",err))
  
      // Delay between each event to simulate a real journey (2 seconds for demo purposes)
      await new Promise(resolve => setTimeout(resolve, getRandomTimeout()*1000));

    } catch (error) {
      console.log(`Error sending ${orderEvents[i].status} for ${brand}, Order ID: ${orderId}`, error);
    }
  }

  console.log(`Order journey for ${brand}, Order ID: ${orderId} completed.`);
}


async function simulateOrderJourney2(brand, orderId, items) {
  const eta = getRandomETA();
  const rider = getRiderDetails();

  const orderEvents = [
    
    { status: 'Unassigned', code: 11, eta: 30, location: locations[0] },
    { status: 'Assigned', code: 2, eta: 20, location: locations[0] },
    { status: 'Seen', code: 3, eta: 20, location: locations[0] },
    { status: 'Scanned', code: 4, eta: 20, location: locations[0] },
    { status: 'OrderPicked', code: 7, eta: 20, location: locations[1] },
    { status: 'OrderPicked', code: 12, eta: 14, location: locations[1] },
    { status: 'OrderPicked', code: 7, eta: 11, location: locations[2] },
    { status: 'OrderPicked', code: 7, eta: 8, location: locations[3] },
    { status: 'OrderPicked', code: 7, eta: 6, location: locations[4] },
    { status: 'OrderPicked', code: 7, eta: 4, location: locations[5] },
    { status: 'OrderPicked', code: 13, eta: 2, location: locations[6] },
    { status: 'Delivered', code: 8, eta: 0, location: locations[7] },
  ];
  
  let isStoreGeoFenceIn=true;
  let etaFlag=false;
  let riderdetailsFlag=false;

  //adding order
  let result=addOrder(false,orderId);
  console.log("adding order",orderId,result);


  for (let i = 0; i < orderEvents.length; i++) {
    try {
      console.log(`Sending "${orderEvents[i].status}" update for ${brand}, Order ID: ${orderId}`);

      if(orderEvents[i].code==2)
      {
          //assigned
          riderdetailsFlag=true;
      }
      if(orderEvents[i].code==7)
      {
        etaFlag=true;
      }
    

      if(orderEvents[i].code===12){
        isStoreGeoFenceIn=false;
      }
      
      // Firestore payload structure
      let firestorePayload = {
        countryId: 2,
        brandId: 3,
        storeId: "115",
        customerPhone: "388296",
        customerName: "Ali Almos",
        storeBSPNumber: "7f98005bdd224e6f9f7207bc43a4",
        storeLocationLat: "26.1826617",
        storeLocationLng: "50.4661924",
        orderId: "18867396",
        externalOrderId:orderId ,//adpid
        almpOrderId: "4c292782f0c7232c3b0fc0e8e2bbc013447ae",
        createdAtTimezone: "2024-12-12T23:42:56Z",
        plannedDeliveryTimezone: "2024-12-13T00:16:47Z",
        orderSourceId: 70,
        almpStatusId: orderEvents[i].code,
        deliveryLocationLat: "26.187386",
        deliveryLocationLng: "50.48678",
        posCreatedAtTimezone: "2024-12-12T23:41:47Z",
        riderLatitude: rider.latitude || "",
        riderLongitude: rider.longitude || "",
        eta: etaFlag? orderEvents[i].eta:"",
        riderId: riderdetailsFlag? rider.id || "":"",
        riderName: riderdetailsFlag?rider.name || "":"",
        riderPhone: riderdetailsFlag? rider.phone || "":"",
        accuracy: "",
        speed: "",
        heading: "0",
        URL: "",
        orderPosId: "63102",
        orderSourceName: "Call Center",
        orderStatusName: orderEvents[i].status,
        isIntegratedPartner: false,
        isOrderOnHold: true,
        isClubbedOrder: true,
        inTransit: false,
        isStoreGeoFenceIn,
        tmpKey1: "",
        tmpKey2: "",
        tmpKey3: "",
        tmpKey4: "",
        tmpKey5: "",
      };

     firestorePayload= Object.assign({},firestorePayload,orderEvents[i].location);

      // Send event to the Firestore
      publishData(brand, firestorePayload)
        .then((msg) => console.log("----Payload Sent Successfully----", msg))
        .catch((err) => console.log("----Error Occurred----", err));

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, getRandomTimeout() * 1000));
    } catch (error) {
      console.log(`Error sending ${orderEvents[i].status} for ${brand}, Order ID: ${orderId}`, error);
    }
  }

   //adding order
   
  result=removeOrder(false,orderId);

  console.log("After Removing Order",orderId,result);

  console.log(`Order journey for ${brand}, Order ID: ${orderId} completed.`);
}

// Simulate orders for all brands
async function simulateOrders(orderId) {
 
  // Simulate order journeys for each brand
  var order=orders[0];
  await simulateOrderJourney2("kfc_uae", orderId, order.items);


}

// Start the order simulation
// simulateOrders();
//module.exports=simulateOrders;
module.exports=simulateOrders;
