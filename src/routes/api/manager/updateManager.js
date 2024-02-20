const { updateManager } = require("../manager");

const updateManagerDetails = async (req, res) => {
  try {
    logger.info("updateManager function called");
    const managerId = req.params.managerId;
    const updatedData = req.body;
    const updatedManager = await updateManager(managerId, updatedData);
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

module.exports = updateManagerDetails;
