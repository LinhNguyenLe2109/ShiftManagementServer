const express = require('express');
const router = express.Router();
const logger = require('../../../logger');
const authenticateJWT = require('../../../middleware/auth');
const authenticateAccessLevel = require('../../../middleware/accessLevel');

// POST /employee/register
// router.post("/register", authenticateJWT, authenticateAccessLevel(["1"]), require("./createNewEmployee"));

// GET /employee/:id
//router.get('/:id', authenticateJWT, "./getEmployeeById");

// PUT /employee/:id
//router.put('/update/:id', authenticateJWT, "./updateEmployeeById");

module.exports = router;
