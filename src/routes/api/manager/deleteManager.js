const { deleteManager } = require("../manager");

const deleteManagerById = async (req, res) => {
  try {
    logger.info("deleteManager function called");
    const managerId = req.params.managerId;
    const success = await deleteManager(managerId);
    if (success) {
      res.status(200).send("Manager deleted successfully");
    } else {
      res.status(404).send("Manager not found or could not be deleted");
    }
  } catch (error) {
    logger.error(`Error deleting manager: ${error}`);
    res.status(500).send("Error in deleteManager");
  }
};

module.exports = deleteManagerById;
