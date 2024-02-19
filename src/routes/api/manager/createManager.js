const { createManager } = require("../manager");

const createNewManager = async (req, res) => {
  try {
    logger.info("createManager function called");
    const managerId = req.body.managerId;
    const success = await createManager(managerId);
    if (success) {
      res.status(200).send("Manager created successfully");
    } else {
      res.status(400).send("Failed to create manager");
    }
  } catch (error) {
    logger.error(`Error creating manager: ${error}`);
    res.status(500).send("Error in createManager");
  }
};

module.exports = createNewManager;
