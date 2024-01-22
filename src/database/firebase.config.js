// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
} = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.FIRESTORE_API_KEY,
//   authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
//   projectId: process.env.FIRESTORE_PROJECT_ID,
//   storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID,
//   appId: process.env.FIRESTORE_APP_ID,
//   measurementId: process.env.FIRESTORE_MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyD5Yao341pTieeaW_zp_RKmqKce5AWQ-8s",
  authDomain: "shiftmanagementserver.firebaseapp.com",
  projectId: "shiftmanagementserver",
  storageBucket: "shiftmanagementserver.appspot.com",
  messagingSenderId: "900891681285",
  appId: "1:900891681285:web:9cb3ff115e5c685080326c",
  measurementId: "G-41B59DGGC4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db, app };
