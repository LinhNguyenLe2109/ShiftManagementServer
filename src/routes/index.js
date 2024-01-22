const express = require("express");
const { collection, getDocs } = require("firebase/firestore");
const { db } = require("../database/firebase.config");
const logger = require("../../logger");

const router = express.Router();
// router.post("/login", require("./login"));

//health check
router.get("/", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  req.log.info("something");
  const citiesCol = collection(db, "users");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  logger.info(cityList);
  await res.json(cityList);
});
module.exports = router;
