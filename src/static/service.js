const { Firestore, doc, setDoc, getDoc } = require("@firebase/firestore");
const { firestore } = require("./firestore");

// Cache to track processed orders
const orders = {};

// Retrieve the distance threshold with validation
const lastCoordinatesUpdatedDistance = (() => {
  const distance = parseInt(process.env.LAST_COORDINATES_UPDATED_DISTANCE || "2", 10);
  return isNaN(distance) || distance <= 0 ? 2 : distance;
})();

// Format date to a custom string
function formatDateToCustomString(date) {
  try {
    console.log("Formatting date:", date);
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) throw new Error("Invalid date value provided.");
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true, timeZone: 'Asia/Kolkata'
    }).format(parsedDate);

    return `${formattedDate} UTC+5:30`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMeters = 6371000;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Publish data to Firestore
async function publishData(brand, data) {
  try {
    if (!data.externalOrderId) throw new Error("Missing required field 'externalOrderId'.");

    const docId = data.externalOrderId || "TRIAL";
    const collectionPath = "kfc_uae1";
    const docRef = doc(firestore, collectionPath, docId);
    console.log("Publishing to Firestore:", collectionPath, docId);

    const existingDoc = await getDoc(docRef);
    const now = new Date().toISOString();
    let lastCoordinatesUpdated = now, trackingId = "";

    if (existingDoc.exists()) {
      const existingData = existingDoc.data();
      if (existingData.riderLatitude && existingData.riderLongitude && data.riderLatitude && data.riderLongitude) {
        const distance = calculateDistance(existingData.riderLatitude, existingData.riderLongitude, data.riderLatitude, data.riderLongitude);
        console.log("Distance calculated:", distance);
        if (distance <= lastCoordinatesUpdatedDistance) lastCoordinatesUpdated = existingData.lastCoordinatesUpdated || now;
      }
      trackingId = existingData.trackId || "";
    }

    const updatedData = { ...data, lastCoordinatesUpdated, payloadUpdateTime: now, trackId: trackingId };
    console.log("Updated Data:", updatedData);
    await setDoc(docRef, updatedData);
    console.log("Document updated successfully with ID:", docId);
    return `Data added successfully with ID: ${docId}`;
  } catch (error) {
    console.error("Error publishing data:", error.message);
    throw new Error(`Error: ${error.message}`);
  }
}

console.log('publishData module loaded');
module.exports = publishData;
