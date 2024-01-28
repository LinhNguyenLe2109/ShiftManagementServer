const logger = require("../../../logger");
const { updateUserInfo, User } = require("../../../database/users");

const updateUser = async (req, res) => {
  const firstName = req.body.firstName ? req.body.firstName : "";
  const lastName = req.body.lastName ? req.body.lastName : "";
  const accessLevel = req.body.accessLevel ? Number(req.body.accessLevel) : 0;
  const reportTo = req.body.reportTo ? req.body.reportTo : "";
  const active = req.body.active ? req.body.active : 0;
  try {
    logger.info("updateUser called");
    const userDecodedToken = res.locals.userDecodedToken;
    const userId = userDecodedToken.user_id;
    const userObj = new User({
      id: userId,
      firstName: firstName,
      lastName: lastName,
      accessLevel: accessLevel,
      reportTo: reportTo,
      active: active,
    });
    const userInfo = await updateUserInfo(userId, userObj);
    // logger.debug(userDecodedToken);
    return res.status(200).json(userInfo);
  } catch (e) {
    logger.error(`Error in getUser: ${e}`);
    return res.status(500).send("Error in getUser");
  }
};

module.exports = updateUser;
