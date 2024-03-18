const logger = require("../../../logger");
const { updateUserInfo, User } = require("../../../database/users");
const verifyString = require("../../../utils/verifyString");
const createErrorResponse = require("../../../utils/createErrorResponse");

const updateUser = async (req, res) => {
  const id = req.body.id ? req.body.id : "";
  if (!verifyString(id)) {
    return res.status(400).json(createErrorResponse(400, "Invalid id"));
  }
  const firstName = req.body.firstName ? req.body.firstName : "";
  const lastName = req.body.lastName ? req.body.lastName : "";
  const accessLevel = req.body.accessLevel ? Number(req.body.accessLevel) : -1;
  const reportTo = req.body.reportTo ? req.body.reportTo : "";
  const active = req.body.active ? req.body.active : -1;
  try {
    logger.info("updateUser called");
    const userObj = new User({
      id: id,
      firstName: firstName,
      lastName: lastName,
      accessLevel: accessLevel,
      reportTo: reportTo,
      active: active,
    });
    const userInfo = await updateUserInfo(id, userObj);
    // logger.debug(userDecodedToken);
    return res.status(200).json(userInfo);
  } catch (e) {
    logger.error(`Error in getUser: ${e}`);
    return res.status(500).send("Error in getUser");
  }
};

module.exports = updateUser;
