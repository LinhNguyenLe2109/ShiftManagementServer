const express = require('express');
const router = express.Router();
const logger = require('../../../logger');
const authenticateJWT = require('../../../middleware/auth');
const authenticateAccessLevel = require('../../../middleware/accessLevel');

const createNewEmployee = require('./createNewEmployee');
const getEmployeeById = require('./getEmployee');
const updateEmployeeById = require('./updateEmployee');

// POST /employee/create
router.post('/create', authenticateJWT, authenticateAccessLevel(['1']), createNewEmployee);

// GET /employee/:id
router.get('/:id', authenticateJWT, getEmployeeById);

// PUT /employee/:id
router.put('/update/:id', authenticateJWT, updateEmployeeById);

module.exports = router;
