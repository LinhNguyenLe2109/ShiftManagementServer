const logger = require("../../../logger");
const { getUserInfo } = require("../../../database/users");

const getUser = async (req, res) => {
  try {
    logger.info("getUserById called");
    const userId = req.params.userId;
    const userInfo = await getUserInfo(userId);
    return res.status(200).json(userInfo);
  } catch (e) {
    logger.error(`Error in getUserById: ${e}`);
    return res.status(500).send("Error in getUserById");
  }
};

module.exports = getUser;
