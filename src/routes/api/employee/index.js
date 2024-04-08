const express = require('express');
const router = express.Router();
const logger = require('../../../logger');
const authenticateJWT = require('../../../middleware/auth');
const authenticateAccessLevel = require('../../../middleware/accessLevel');

// POST /employee/register
 router.post("/register", authenticateJWT, authenticateAccessLevel(["1"]), require("./createNewEmployee"));
// Sample post body
// {
//     "email":"",
//     "password":"",
//     "firstName":"",
//     "lastName":"",
//     "accessLevel":0,
//     "active":1,
//     "managerId":""
// }

// PUT /employee/:id
// router.put("/:id", authenticateJWT, authenticateAccessLevel(["1"]), require("./updateReportTo"));
// Example body:
// {
//     "managerId": "",
// }

// GET /employee/:id
//router.get('/:id', authenticateJWT, "./getEmployeeById");

// PUT /employee/:id
router.put('/:id', authenticateJWT, authenticateAccessLevel(["1"]), require('./updateEmployeeById'));

module.exports = router;
