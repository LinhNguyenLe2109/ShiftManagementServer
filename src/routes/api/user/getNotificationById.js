const logger = require("../../../logger");
const { getNotification } = require("../../../database/notifications");

const getNotificationById = async (req, res) => {
  try {
    logger.info("getNotificationById called");
    const notificationId = req.params.notificationId;
    const notificationInfo = await getNotification(notificationId);
    return res.status(200).json(notificationInfo);
  } catch (e) {
    logger.error(`Error in getNotificationById: ${e}`);
    return res.status(500).send("Error in getNotificationById");
  }
};

module.exports = getNotificationById;
