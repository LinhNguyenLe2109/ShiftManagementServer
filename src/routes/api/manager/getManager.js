const { getUserInfo } = require("../../../database/users");
const logger = require("../../../logger");

const getManagerDetails = async (req, res) => {
  try {
    logger.info("getManager function called");
    const managerId = req.params.managerId;
    const manager = await getUserInfo(managerId);
    if (manager) {
      res.status(200).json(manager.accountInfo);
    } else {
      res.status(404).send("Manager not found");
    }
  } catch (error) {
    logger.error(`Error getting manager: ${error}`);
    res.status(500).send("Error in getManager");
  }
};

module.exports = getManagerDetails;
