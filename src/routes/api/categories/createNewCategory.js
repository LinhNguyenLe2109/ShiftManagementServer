const express = require("express");
const router = express.Router();
const { createCategory } = require("../category");

const createNewCategory = async (req, res) => {
  try {
    logger.info("createCategory function called");
    const categoryData = req.body;
    const newCategory = await createCategory(categoryData);
    res.status(200).json(newCategory);
  } catch (error) {
    logger.error(`Error in createCategory: ${error}`);
    res.status(500).json('Error in createCategory');
  }
};

module.exports = createNewCategory;
