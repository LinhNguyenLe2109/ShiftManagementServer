const express = require("express");
const router = express.Router();
const { updateCategory } = require("../category");

const updateCategoryHandler = async (req, res) => {
  try {
    logger.info("updateCategory function called");
    const updatedCategory = req.body;
    const updated = await updateCategory(updatedCategory);
    res.status(200).json(updated);
  } catch (error) {
    logger.error(`Error in updateCategory: ${error}`);
    res.status(500).json('Error in updateCategoryHandler');
  }
};

module.exports = updateCategoryHandler;
