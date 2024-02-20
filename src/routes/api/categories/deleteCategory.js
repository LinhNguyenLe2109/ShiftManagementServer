const express = require("express");
const router = express.Router();
const { deleteCategory } = require("../category");

const deleteCategoryHandler = async (req, res) => {
  try {
    logger.info("deleteCategory function called");
    const { categoryId } = req.params;
    const deleted = await deleteCategory(categoryId);
    res.status(200).json({ deleted });
  } catch (error) {
    logger.error(`Error in deleteCategory: ${error}`);
    res.status(500).json('Error in deleteCategory');
  }
};

module.exports = deleteCategoryHandler;
