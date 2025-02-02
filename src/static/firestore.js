// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, onSnapshot } = require("firebase/firestore");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6J-lPmtiFT1IpfCqrv7FY_wZKdWHsCHE",
  authDomain: "almp-poc-firestore-v1.firebaseapp.com",
  projectId: "almp-poc-firestore-v1",
  storageBucket: "almp-poc-firestore-v1.appspot.com",
  messagingSenderId: "731495409052",
  appId: "1:731495409052:web:c097f46a89ca0e07e21459",
  measurementId: "G-HVY0V4RTDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Function to listen to real-time changes (added and modified documents)
const listenToChanges = () => {
    const snapshot = collection(firestore, 'pocv1');

    // Real-time listener for changes in the collection
    onSnapshot(snapshot, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                console.log(`New document added: ${change.doc.id} =>`, change.doc.data());
            } 
            if (change.type === 'modified') {
                console.log(`Document modified: ${change.doc.id} =>`, change.doc.data());
            }
        });
    }, (error) => {
        console.error('Error listening to Firestore changes:', error);
    });
};

// Call the function to start listening
listenToChanges();

// Export Firestore client if needed for other parts of the application
module.exports = { firestore };
