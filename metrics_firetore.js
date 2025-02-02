// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, onSnapshot, updateDoc } = require("firebase/firestore");

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgDma1m31t_zeJI-QrfG7BCsAQl-bbkDU",
    authDomain: "kfc-me-dev.firebaseapp.com",
    databaseURL: "https://kfc-me-dev.firebaseio.com",
    projectId: "kfc-me-dev",
    storageBucket: "kfc-me-dev.appspot.com",
    messagingSenderId: "196569009619",
    appId: "1:196569009619:web:b625b5ad40fab219fc7326",
    measurementId: "G-RCE0QBTRM1"
  };;

Recieving_Timeout_Error
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let updates={}

let total=0;
let custom_doc="modificationCount";
let custom_doc_list={}
let customdocinitales="10220250129";

let almpStatusId=8;
let almpStatusId_count=0;

let total_delivered=0;
let total_not_delivered=0;




// Function to listen to real-time changes (added and modified documents)
const listenToChanges = async() => {
  const q = firestore.collection('col').where('country', '=', 'USA');
  const options = { analyze : 'false' };
  
  const explainResults = await q.explain(options);
  
  const metrics = explainResults.metrics;
  const plan = metrics.planSummary;

};

listenToChanges()

// Call the function to start listening
//listenToChanges();

// Handle process exit to perform cleanup or print a message
process.on('exit', (code) => {
    console.log('Exiting the application...');
    console.log('Total updates processed: ', total);
    console.log('updated',updates)
    console.log('Exiting with code:', code);
    console.log("custom",custom_doc)
    console.log("custom",custom_doc_list)
    console.log("custom doc delivered ",almpStatusId_count)
    console.log("total deliverd",total_delivered,"  , total non deliverd", total_not_delivered)
});

process.on('SIGINT', () => {
    console.log('Caught interrupt signal (SIGINT), exiting...');
    console.log('Total updates processed: ', total);
    console.log('Total updates processed: ', total);
    console.log('updated',updates)
    console.log("custom",custom_doc)
    console.log("custom_list",custom_doc_list)
    console.log("custom doc delivered ",almpStatusId_count)
    console.log("total deliverd",total_delivered,"  , total non deliverd", total_not_delivered)
    process.exit();
});

// Export Firestore client if needed for other parts of the application
module.exports = { firestore };
