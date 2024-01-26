const logger = require("../../../logger");
const { updateUserInfo } = require("../../../database/users");

const updateUser = async (req, res) => {
  try {
    logger.info("updateUser called");
    const userDecodedToken = res.locals.userDecodedToken;
    const userId = userDecodedToken.user_id;
    const userInfo = await updateUserInfo(userId, req.body);
    // logger.debug(userDecodedToken);
    return res.status(200).json(userInfo);
  } catch (e) {
    logger.error(`Error in getUser: ${e}`);
    return res.status(500).send("Error in getUser");
  }
};

module.exports = updateUser;
