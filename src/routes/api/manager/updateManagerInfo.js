const { updateManager } = require("../../../database/manager");
const { getUserInfo } = require("../../../database/users");
const logger = require("../../../logger");

const updateManagerInfo = async (req, res) => {
  try {
    // logger.info("updateManager function called");
    const managerId = req.params.managerId;
    const managerInfoId = (await getUserInfo(managerId)).accountInfo.id;
    // logger.debug("ManagerInfoId: " + managerInfoId);
    const updateData = req.body;
    const updatedManager = await updateManager(managerInfoId, updateData);
    if (updatedManager) {
      res
        .status(200)
        .json({
          success: true,
          message: "Manager updated",
          data: updatedManager,
        });
    } else {
      res.status(404).json({ success: false, message: "Manager not found" });
    }
  } catch (error) {
    logger.error(`Error updating manager: ${error}`);
    res.status(500).send("Error in updateManager");
  }
};

module.exports = updateManagerInfo;
