const { initializeApp } = require ("firebase-admin/app");
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
const firebaseApp = initializeApp(firebaseConfig);