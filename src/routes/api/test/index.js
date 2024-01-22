// This is used for route testing, will delete later
const express = require("express");
const router = express.Router();
const logger = require("../../../logger");

// GET /user
router.get("/test", require("./getUsers"));

module.exports = router;
