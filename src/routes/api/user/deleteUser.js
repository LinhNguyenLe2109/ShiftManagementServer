const logger = require("../../../logger");
const { deleteUser } = require("../../../database/users");
const createSuccessResponse = require("../../../utils/createSuccessResponse");
const createErrorResponse = require("../../../utils/createErrorResponse");

const deleteUserRoute = async (req, res) => {
  const id = req.params.id;
  try {
    logger.info(`deleteUser called with id: ${id}`);
    const result = await deleteUser(id);
    if (!result) {
      return res.status(404).json(createErrorResponse(404, "User not found or there may be some employees under this account if it's a manager account."));
    }
    return res
      .status(200)
      .send(createSuccessResponse({success: true, message: "User deleted" }));
  } catch (e) {
    logger.error(`Error in deleteUser: ${e}`);
    return res
      .status(500)
      .send(createErrorResponse(500, "Internal Server Error"));
  }
};

module.exports = deleteUserRoute;
