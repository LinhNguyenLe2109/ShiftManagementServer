const { addNotificationToUser } = require("../../../database/users");
const logger = require("../../../logger");

const addNotificationToList = async (req, res) => {
    try {
    const { userId, notificationId } = req.body;
    if (!userId || !notificationId) {
      return res.status(400).json({ success: false, message: "Missing userId or notificationId" });
    }

    const result = await addNotificationToUser(userId, notificationId);
    if (result) {
      return res.status(200).json({ success: true, message: "Notification added successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Failed to add notification" });
    }
  } catch (error) {
    logger.error(`Error adding notification to user: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = addNotificationToList;