const { initializeApp } = require ("firebase-admin/app");
const { initializeApp: initializeAdminApp  } = require ("firebase/app");
const { getAuth } = require("firebase/auth");
const { getAuth: getAdminAuth } = require("firebase-admin/auth");

if (!(process.env.appId && process.env.messagingSenderId && process.env.apiKey)) {
  throw new Error("missing expected env vars: appId, messagingSenderId, apiKey");
} 
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "shiftmanagementserver.firebaseapp.com",
  projectId: "shiftmanagementserver",
  storageBucket: "shiftmanagementserver.appspot.com",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};
const firebase = initializeApp(firebaseConfig);
const firebaseAdmin = initializeAdminApp(firebaseConfig);
const auth = getAuth();
const authAdmin = getAdminAuth();
module.exports = { auth, authAdmin, firebase, firebaseAdmin };