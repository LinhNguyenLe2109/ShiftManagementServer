const { getEmployee } = require('./employee');
const logger = require('../../../logger');

const getEmployeeById = async (req, res) => {
  try {
    logger.info('getEmployeeById called');
    const { id } = req.params;
    const employee = await getEmployee(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    logger.error(`Error getting employee: ${error}`);
    res.status(500).send('Error in getEmployeeById');
  }
};

module.exports = getEmployeeById;
