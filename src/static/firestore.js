// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, onSnapshot } = require("firebase/firestore");

// Firebase configuration
const firebaseConfig =  {
    apiKey: "AIzaSyBgk2nC0dVCbIKNa_pKh0xFkdPU70JeJVA",
    authDomain: "kfc-me-dev.firebaseapp.com",
    databaseURL: "https://kfc-me-dev.firebaseio.com",
    projectId: "kfc-me-dev",
    storageBucket: "kfc-me-dev.appspot.com",
    messagingSenderId: "196569009619",
    appId: "1:196569009619:web:c5497de6dd662a16fc7326",
    measurementId: "G-E89WWZX5RK"
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
