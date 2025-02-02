import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import Watch
import time
import signal
import sys

# Manual Firebase configuration
firebase_config = {
    "apiKey": "AIzaSyAgDma1m31t_zeJI-QrfG7BCsAQl-bbkDU",
    "authDomain": "kfc-me-dev.firebaseapp.com",
    "databaseURL": "https://kfc-me-dev.firebaseio.com",
    "projectId": "kfc-me-dev",
    "storageBucket": "kfc-me-dev.appspot.com",
    "messagingSenderId": "196569009619",
    "appId": "1:196569009619:web:b625b5ad40fab219fc7326",
    "measurementId": "G-RCE0QBTRM1"
}

# Initialize Firebase manually (only necessary if you don't have the serviceAccountKey)
cred = credentials.ApplicationDefault()  # Use default credentials (no service account key needed)
firebase_admin.initialize_app(cred, {
    'projectId': firebase_config['projectId']
})

# Initialize Firestore client
db = firestore.client()

# Data structure to keep track of document updates
updates = {}
total_events_received = 0  # Variable to track total events received

def listen_to_changes():
    global total_events_received
    # Reference to the collection
    collection_ref = db.collection("kfc_uae")
    
    # Watch for changes in the collection
    watcher = Watch(collection_ref)
    
    # Callback function to process document changes
    def on_snapshot(doc_snapshot, changes, read_time):
        global total_events_received
        for change in changes:
            doc_id = change.document.id
            
            # Update the updates dictionary
            if doc_id in updates:
                updates[doc_id] += 1
            else:
                updates[doc_id] = 1

            # Increase the total event count
            total_events_received += 1
            print(f"Total events received: {total_events_received}")

            # Handle added or modified documents
            if change.type.name == "ADDED":
                print(f"New document added: {doc_id}")
            elif change.type.name == "MODIFIED":
                print(f"Document modified: {doc_id}")

    # Start listening
    watcher.on_snapshot(on_snapshot)

# Signal handler to gracefully stop the script and print updates
def signal_handler(sig, frame):
    print(f"\nTotal events received: {total_events_received}")
    print("Updates dictionary:")
    print(updates)
    sys.exit(0)

# Set up the signal handler to stop the script manually (Ctrl+C)
signal.signal(signal.SIGINT, signal_handler)

# Call the function to start listening
listen_to_changes()

# Keep the script running
while True:
    time.sleep(1)

