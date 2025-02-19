// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, onSnapshot, updateDoc } = require("firebase/firestore");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLl6uIELGFEsQ3QWvGEDrT7jpwLQrC53A",
  authDomain: "kfc-firestore.firebaseapp.com",
  databaseURL: "https://kfc-firestore-default-rtdb.firebaseio.com",
  projectId: "kfc-firestore",
  storageBucket: "kfc-firestore.appspot.com",
  messagingSenderId: "832716360145",
  appId: "1:832716360145:web:c59248110faccc61ff78f0",
  measurementId: "G-KCZPCW7QQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let updates={}

let total=0;
let custom_doc="modificationCount";
let custom_doc_list={}
let customdocinitales="";

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

    listenToChanges(`${val}`);
  
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
