const { getManager } = require("../../../database/manager");
const logger = require("../../../logger");

const getCategoryList = async (req, res) => {
  try {
    logger.info("getCategoryList function called");
    const managerId = req.params.managerId;
    logger.info("ManagerId: " + managerId);
    const manager = await getManager(managerId);
    logger.debug("Categories: " + JSON.stringify(manager));
    const categoryList = manager.categories.map(category => category.name);
    if (manager) {
      res.status(200).json(categoryList);
    } else {
      res.status(404).send("Manager not found");
    }
  } catch (error) {
    logger.error(`Error getting manager category list: ${error}`);
    res.status(500).send("Error in getCategoryList");
  }
};

module.exports = getCategoryList;
