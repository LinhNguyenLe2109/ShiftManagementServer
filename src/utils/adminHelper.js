const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc } = require("firebase/firestore");
const logger = require("../logger");
const { getUserInfo } = require("../database/users");

