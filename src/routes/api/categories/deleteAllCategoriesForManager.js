const express = require("express");
const router = express.Router();
const { deleteAllCategoriesForManager } = require("../category");

const deleteAllCategoriesForManagerHandler = async (req, res) => {
  try {
    logger.info("deleteAllCategoriesForManager function called");
    const { managerId } = req.params;
    const deleted = await deleteAllCategoriesForManager(managerId);
    res.status(200).json({ deleted });
  } catch (error) {
    logger.error(`Error in deleteAllCategoriesForManager: ${error}`);
    res.status(500).json('Error in deleteAllCategoriesForManager');
  }
};

module.exports = deleteAllCategoriesForManagerHandler;
