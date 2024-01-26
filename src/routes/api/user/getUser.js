const logger = require("../../../logger");
const { getUserInfo } = require("../../../database/users");

const getUser = async (req, res) => {
  try {
    logger.info("getUser called");
    const userDecodedToken = res.locals.userDecodedToken;
    const userId = userDecodedToken.user_id;
    const userInfo = await getUserInfo(userId);
    // logger.debug(userDecodedToken);
    return res.status(200).json(userInfo);
  } catch (e) {
    logger.error(`Error in getUser: ${e}`);
    return res.status(500).send("Error in getUser");
  }
};

module.exports = getUser;
