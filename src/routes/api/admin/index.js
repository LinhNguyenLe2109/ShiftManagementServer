const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/all", authenticateJWT, authenticateAccessLevel(["2"]), require("./getAllAdminsAndManagers"));

module.exports = router;