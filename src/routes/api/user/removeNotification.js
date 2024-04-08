const { removeNotificationFromUser } = require("../../../database/users");
const logger = require("../../../logger");

const removeNotification = async (req, res) => {
    try {
    const { userId, notificationId } = req.body;
    if (!userId || !notificationId) {
      return res.status(400).json({ success: false, message: "Missing userId or notificationId" });
    }

    const result = await removeNotificationFromUser(userId, notificationId);
    if (result) {
      return res.status(200).json({ success: true, message: "Notification removed successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Failed to remove notification" });
    }
  } catch (error) {
    logger.error(`Error removing notification from user: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = removeNotification;