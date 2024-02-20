const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

// POST /categories/register
router.post("/register", authenticateJWT, authenticateAccessLevel(["1"]), require("./createNewCategory"));
// Example body: 
// {
//     "name":"",
//     "description":"",
//     "managerId":""
// }

// GET /categories/categoryId
router.get("/:categoryId", authenticateJWT, require("./getCategory"));
// Response body:
// {
//     "id": "",
//     "name": "",
//     "description": "",
//     "createdBy": ""
// }

module.exports = router;

