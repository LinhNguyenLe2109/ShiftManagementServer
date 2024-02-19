const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

// POST /manager/create
router.post("/create", authenticateJWT, authenticateAccessLevel(["2"]), require("./createManager"));

// GET /manager/:managerId
router.get("/:managerId", authenticateJWT, require("./getManager"));

// PUT /manager/:managerId
router.put("/:managerId", authenticateJWT, authenticateAccessLevel(["2"]), require("./updateManager"));

// DELETE /manager/:managerId
router.delete("/:managerId", authenticateJWT, authenticateAccessLevel(["2"]), require("./deleteManager"));

module.exports = router;
