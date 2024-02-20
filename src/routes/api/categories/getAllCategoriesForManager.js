const express = require("express");
const router = express.Router();
const { getAllCategoriesForManager } = require("../category");

const getAllCategoriesForManagerHandler = async (req, res) => {
  try {
    logger.info("getAllCategoriesForManager function called");
    const { managerId } = req.params;
    const categories = await getAllCategoriesForManager(managerId);
    res.status(200).json(categories);
  } catch (error) {
    logger.error(`Error in getAllCategoriesForManager: ${error}`);
    res.status(500).json('Error in getAllCategoriesForManager');
  }
};

module.exports = getAllCategoriesForManagerHandler;
