const express = require("express");
const { collection, getDocs } = require("firebase/firestore");
const { db } = require("../database/firebase.config");
const logger = require("../logger");
const authenticateJWT = require("../middleware/auth");

const router = express.Router({ mergeParams: true });
router.use("/user", require("./api/user"));

//health check
router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.json("Hello World!");
});
module.exports = router;
