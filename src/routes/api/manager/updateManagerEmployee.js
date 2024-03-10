const { updateManager } = require("../../../database/manager");
const { getUserInfo } = require("../../../database/users");
const logger = require("../../../logger");

const updateManagerEmployee = async (req, res) => {
  try {
    logger.info("updateManagerEmployee function called");
    const managerInfoId = (await getUserInfo(req.body.managerId)).accountInfo.id;
    const employeeToAdd = req.body.managerUpdatedData.addEmployee;
    const updatedManager = await updateManager(managerInfoId, { addEmployee: employeeToAdd });
    if (updatedManager) {
      res.status(200).json(updatedManager);
    } else {
      res.status(404).send("Manager not found");
    }
  } catch (error) {
    logger.error(`Error updating manager: ${error}`);
    res.status(500).send("Error in updateManager");
  }
};

module.exports = updateManagerEmployee;