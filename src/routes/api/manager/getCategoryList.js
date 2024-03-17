const { getCategory } = require("../../../database/category");
const { getManager } = require("../../../database/manager");
const logger = require("../../../logger");

const getCategoryList = async (req, res) => {
  try {
    logger.info("getCategoryList function called");
    const managerId = req.params.managerId;
    logger.info("ManagerId: " + managerId);
    const manager = await getManager(managerId);
    logger.debug("Categories: " + JSON.stringify(manager.categoryList));
    // const categoryList = await manager.categoryList.map(async (category) => {
    //   return await getCategory(category);
    // });
    let categoryList = [];
    for (let i = 0; i < manager.categoryList.length; i++) {
      const category = await getCategory(manager.categoryList[i]);
      categoryList.push(category.name);
    }
    // logger.debug(categoryList);
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
