const express = require("express");
const router = express.Router();
const { getCategory } = require("../../../database/category");
const logger = require("../../../logger");

const getCategoryHandler = async (req, res) => {
  try {
    logger.info("getCategory function called");
    const { categoryId } = req.params;
    const category = await getCategory(categoryId);
    res.status(200).json(category);
  } catch (error) {
    logger.error(`Error in getCategory: ${error}`);
    res.status(500).json('Error in getCategoryHandler');
  }
};

module.exports = getCategoryHandler;
