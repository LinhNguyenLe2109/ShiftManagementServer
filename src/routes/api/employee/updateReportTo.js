const { updateEmployee } = require('../../../database/employee');
const logger = require('../../../logger');

const updateReportTo = async (req, res) => {
  try {
    logger.info('updateReportTo called');
    const { id } = req.params;
    const managerId = req.body.managerId;
    logger.debug("ManagerId to update: " + managerId);
    const employee = await updateEmployee(id, { reportTo: managerId });
    if (employee) {
      res.status(200).json('Employee updated');
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    logger.error(`Error updating employee: ${error}`);
    res.status(500).send('Error in updateReportTo');
  }
};

module.exports = updateReportTo;
