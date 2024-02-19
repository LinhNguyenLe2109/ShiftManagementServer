const { createEmployee } = require('./employee');
const logger = require('../../../logger');

const createNewEmployee = async (req, res) => {
  try {
    logger.info('createNewEmployee called');
    const { accountInfo, managerId } = req.body;
    const employee = await createEmployee(accountInfo, managerId);
    res.status(201).json(employee);
  } catch (error) {
    logger.error(`Error creating employee: ${error}`);
    res.status(500).send('Error in createNewEmployee');
  }
};

module.exports = createNewEmployee;
