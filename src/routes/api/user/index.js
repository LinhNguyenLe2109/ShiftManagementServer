const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

// GET /user
router.get("/", authenticateJWT, require("./getUser"));
// router.get("/", require("./getUser"));

// GET /user/:userId
router.get("/:userId", authenticateJWT, require("./getUserById"));

// POST /user/login
router.post("/login", require("./authenticateUser"));

// POST /user/register
router.post("/register", authenticateJWT, authenticateAccessLevel(["1", "2"]), require("./createNewUser"));

// POST /user/notification
router.post("/notification", authenticateJWT, require("./createNotification"));
// Example body:
// {
//     "createdBy": "",
//     "title": "",
//     "content": ""
// }

// PUT /user
router.put("/", authenticateJWT, require("./updateUser"));
module.exports = router;
