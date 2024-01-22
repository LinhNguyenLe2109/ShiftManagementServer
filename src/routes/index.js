const express = require("express");
const { collection, getDocs } = require("firebase/firestore");
const { db } = require("../database/firebase.config");
const logger = require("../logger");

const router = express.Router();
router.use("/user", require("./api/user"));
// router.use("/test", require("./api/test"));

//health check
router.get("/", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  const citiesCol = collection(db, "users");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  logger.info(cityList);
  await res.json(cityList);
});
module.exports = router;
