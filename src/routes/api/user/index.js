const express = require("express");
const router = express.Router();
const logger = require("../../../logger");

// POST /user/login
router.post("/login", require("./authenticateUser"));


// POST /user/register
router.post("/register", require("./createNewUser"));
module.exports = router;
