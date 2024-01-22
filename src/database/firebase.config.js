const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
var admin = require("firebase-admin");
var serviceAccount = require("./shiftmanagementserver-firebase-adminsdk-6iijj-6560ad3c90.json");
const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
  projectId: process.env.FIRESTORE_PROJECT_ID,
  storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.FIRESTORE_APP_ID,
  measurementId: process.env.FIRESTORE_MEASUREMENT_ID,
};


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIRESTORE_PROJECT_ID,
    privateKey: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
  })
});


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db, app, admin };
