const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");

// GET /user
router.get("/", authenticateJWT, require("./getUser"));
// router.get("/", require("./getUser"));

// POST /user/login
router.post("/login", require("./authenticateUser"));

// POST /user/register
router.post("/register", authenticateJWT, require("./createNewUser"));

// PUT /user
router.put("/", authenticateJWT, require("./updateUser"));
module.exports = router;
