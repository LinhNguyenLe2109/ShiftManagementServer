const express = require("express");
const { collection, getDocs } = require("firebase/firestore");
const { db } = require("../database/firebase.config");
const logger = require("../logger");
const authenticateJWT = require("../middleware/auth");

const router = express.Router({ mergeParams: true });
router.use("/user", require("./api/user"));
router.use("/shifts", require("./api/shifts"));
router.use("/categories", require("./api/categories"));
router.use("/employee", require("./api/employee"));
router.use("/manager", require("./api/manager"));

//health check
router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.json("Hello World!");
});
module.exports = router;
