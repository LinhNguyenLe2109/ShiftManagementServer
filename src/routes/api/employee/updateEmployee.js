const { updateEmployee } = require('./employee');
const logger = require('../../../logger');

const updateEmployeeById = async (req, res) => {
  try {
    logger.info('updateEmployeeById called');
    const { id } = req.params;
    const updatedEmployee = req.body;
    const employee = await updateEmployee(id, updatedEmployee);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    logger.error(`Error updating employee: ${error}`);
    res.status(500).send('Error in updateEmployeeById');
  }
};

module.exports = updateEmployeeById;
