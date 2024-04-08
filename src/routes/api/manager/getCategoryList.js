const { getCategory } = require("../../../database/category");
const { getUserInfo } = require("../../../database/users");
const logger = require("../../../logger");

const getCategoryList = async (req, res) => {
  try {
    logger.info("getCategoryList function called");
    const managerId = req.params.managerId;
    logger.info("ManagerId: " + managerId);
    const manager = await getUserInfo(managerId);
    let categoryList = [];
    for (let i = 0; i < manager.accountInfo.categoryList.length; i++) {
      const category = await getCategory(manager.accountInfo.categoryList[i]);
      categoryList.push(category.name);
    }
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