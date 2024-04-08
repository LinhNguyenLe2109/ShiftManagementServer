const { deleteNotification } = require("../../../database/notifications");
const logger = require("../../../logger");

const deleteUserNotification = async (req, res) => {
  try {
    logger.info("deleteNotification function called");
    const { notificationId } = req.body;
    await deleteNotification(notificationId)
    res.status(201).json('Notification deleted!');
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json('Error deleting notification');
  }
};

module.exports = deleteUserNotification;