const { Firestore, doc, setDoc, getDoc } = require("@firebase/firestore");

const {firestore}=require("./firestore")
// Cache to keep track of processed orders
const orders = {};


// Retrieve the distance threshold, handle typos and undefined values
const lastCoordinatesUpdatedDistance = (() => {
  const distanceEnv = process.env.LAST_COORDINATES_UPDATED_DISTANCE || "2"; // Default to "2" if undefined
  const distance = parseInt(distanceEnv, 10);
  return isNaN(distance) || distance <= 0 ? 2 : distance;
})();

// Function to publish data to Firestore
async function publishData(brand, data) {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure the externalOrderId is defined
      const orderId = data.externalOrderId;
      if (!orderId) {
        throw new Error("Missing required field 'externalOrderId' in data.");
      }

      // Prepare the topic and document reference
      const topic = orderId;
      console.log("Publishing topic:", topic, data);

      const docId = orderId || "TRIAL"; // Fallback to "TRIAL" if no orderId
      const collectionPath = brand; // Collection naming convention
      const docRef = doc(firestore, collectionPath, docId);

      // Fetch existing document from Firestore
      const existingDoc = await getDoc(docRef);
      const now = new Date().toISOString();
      let lastCoordinatesUpdated = now;
      let payloadUpdateTime = now;

      if (existingDoc.exists()) {
        const existingData = existingDoc.data();

        // Determine if rider's coordinates have changed by 2 meters
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const earthRadiusMeters = 6371000; // Earth's radius in meters

        const lat1 = toRadians(existingData.riderLatitude);
        const lon1 = toRadians(existingData.riderLongitude);
        const lat2 = toRadians(data.riderLatitude);
        const lon2 = toRadians(data.riderLongitude);

        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;

        const a =
          Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusMeters * c;
        console.log("Distance", distance);

        if (distance > lastCoordinatesUpdatedDistance) {
          lastCoordinatesUpdated = now;
        } else {
          lastCoordinatesUpdated = existingData.last_coordinates_updated || now;
        }

        payloadUpdateTime = now;
      }

      // Add additional keys to the payload
      const updatedData = {
        ...data,
       lastCoordinatesUpdated,
        payloadUpdateTime,
      };

      // Add or overwrite the document in Firestore
      await setDoc(docRef, updatedData);

      console.log("Document added with ID:", docId);
      resolve(`Data added successfully with ID: ${docId}`);
    } catch (error) {
      console.error("Error:", error.message);
      reject(`Error: ${error.message}`);
    }
  });
}

console.log('publishData module loaded');
module.exports =  publishData ;
