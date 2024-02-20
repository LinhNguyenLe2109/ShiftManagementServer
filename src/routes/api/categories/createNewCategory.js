const express = require("express");
const router = express.Router();
const logger = require("../../../logger");
const { Category, createCategory } = require("../../../database/category");
const { v4: uuidv4 } = require("uuid");

const createNewCategory = async (req, res) => {
  try {
    logger.info("createCategory function called");
    categoryObj = new Category({
      id: uuidv4(),
      name: req.body.name ? req.body.name : "",
      description: req.body.description ? req.body.description : "",
      createdBy: req.body.managerId
    });
    
    const newCategory = await createCategory(categoryObj);
    res.status(200).json(newCategory);
  } catch (error) {
    logger.error(`Error in createCategory: ${error}`);
    res.status(500).json('Error in createCategory');
  }
};

module.exports = createNewCategory;
