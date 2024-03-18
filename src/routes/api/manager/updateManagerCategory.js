const { updateManager } = require("../../../database/manager");
const { getUserInfo } = require("../../../database/users");
const logger = require("../../../logger");

const updateManagerCategory = async (req, res) => {
  try {
    logger.info("updateManagerCategory function called");    
    const managerInfoId = (await getUserInfo(req.body.managerId)).accountInfo.id;
    logger.debug("ManagerInfoId: " + managerInfoId);
    const categoryToAdd = req.body.managerUpdatedData.addCategory;
    const updatedManager = await updateManager(managerInfoId, { addCategory: categoryToAdd });
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

module.exports = updateManagerCategory;