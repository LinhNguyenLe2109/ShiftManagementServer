const { createNotification } = require("../../../database/notifications");
const logger = require("../../../logger");

const createNewNotification = async (req, res) => {
  try {
    logger.info("createNewNotification function called");
    const { createdBy, title, content } = req.body;
    const notification = await createNotification({ createdBy, title, content });
    // Todo: check user type and 
    // add to manager or employee notification list
    res.status(201).json(notification);
  } catch (error) {
    logger.error('Error creating notification:', error);
    res.status(500).json('Error creating notification');
  }
};

module.exports = createNewNotification;