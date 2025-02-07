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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let updates={}

let total=0;
let custom_doc="modificationCount";
let custom_doc_list={}
let customdocinitales="77777221";

let almpStatusId=8;
let almpStatusId_count=0;

let total_delivered=0;
let total_not_delivered=0;
let total_evets=0;
let totoal_col={}
// Function to listen to real-time changes (added and modified documents)
const listenToChanges = (col) => {
  console.log("listening ",col)
    const snapshot = collection(firestore, col);
    totoal_col[col]=0;

    // Real-time listener for changes in the collection
    onSnapshot(snapshot, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            let id=change.doc.id;
            let time=change.doc.data()["payloadUpdateTime"];
            let recieved=change.doc.data()[custom_doc];

            totoal_col[col]=totoal_col[col]+1;

          if(id.includes(customdocinitales) && time>'2025-02-04 12:52:05.254 +0000' ){
            custom_doc_list[id]={
              "recieved":change.doc.data()[custom_doc],
              "lasttime":change.doc.data()["payloadUpdateTime"],

            }

            total_evets+=recieved;
            //modifcationcount key in custom_doc
            console.log("custom doc delivered ",custom_doc_list[id]);

            if(almpStatusId==change.doc.data()["almpStatusId"])
            {
              custom_doc_list[id]["delivered"]= "yes"
              total_delivered++;
            }
            else{
              custom_doc_list[id]["delivered"]= "no"
              total_not_delivered++;
            }
         
          }
         
        
                               

        });
    }, (error) => {
        console.error('Error listening to Firestore changes:', error);
    });
};

['kfc_uae','kfc_egypt','kfc_kuwait'].forEach(val=>{
  
  for (let i = 1; i <= 1; i++) {
    listenToChanges(`${val}${i}`);
  }
}
)
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
    console.log("totoal events recieed",total_evets)
    console.log("total events",totoal_col)
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
    console.log("totoal events recieed",total_evets)
    console.log("total events",totoal_col)
    process.exit();
});

// Export Firestore client if needed for other parts of the application
module.exports = { firestore };
