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
let custom_doc=0;
let custom_doc_list={}
let customdocinitales="10420250127"
// Function to listen to real-time changes (added and modified documents)
const listenToChanges = (col) => {
    const snapshot = collection(firestore, col);

    // Real-time listener for changes in the collection
    onSnapshot(snapshot, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            let id=change.doc.id;
            if(updates[id]){
                updates[id]=updates[id]+1;
                // console.log(updates)
                total++;
                console.log("total ",total)

            }
            else{
                updates[id]=1;
            }

            
           
            
            if (change.type === 'added') {
                console.log(`New document added: ${change.doc.id} =>`);
                if(id.includes(customdocinitales) && !custom_doc_list[id]){
                    custom_doc++;
                    custom_doc_list[id]=1;
                    console.log("custom doc created",custom_doc)
                }
            } 
            if (change.type === 'modified') {

                if(id.includes(customdocinitales) ){
                    custom_doc++;
                    custom_doc_list[id]=custom_doc_list[id]++;
                    console.log("custom doc modified ",custom_doc)
                }

                console.log(`Document modified: ${change.doc.id} =>`);
            }

        });
    }, (error) => {
        console.error('Error listening to Firestore changes:', error);
    });
};

['kfc_uae','kfc_egypt','kfc_kuwait','kfc_saudiarabia'].forEach(val=>listenToChanges(val))
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
});

process.on('SIGINT', () => {
    console.log('Caught interrupt signal (SIGINT), exiting...');
    console.log('Total updates processed: ', total);
    console.log('Total updates processed: ', total);
    console.log('updated',updates)
    console.log("custom",custom_doc)
    console.log("custom_list",custom_doc_list)
    process.exit();
});

// Export Firestore client if needed for other parts of the application
module.exports = { firestore };
