const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../../../logger");
const authenticateJWT = require("../../../middleware/auth");
const authenticateAccessLevel = require("../../../middleware/accessLevel");

const createNewCategory = require("./createNewCategory");
const getAllCategoriesForManager = require("./getAllCategoriesForManager");
const getCategory = require("./getCategory");
const updateCategory = require("./updateCategory");
const deleteCategory = require("./deleteCategory");
const deleteAllCategoriesForManager = require("./deleteAllCategoriesForManager");

// POST /categories/create
router.post("/create", authenticateJWT, authenticateAccessLevel(["1"]), createNewCategory);

// GET /categories/all/:managerId
router.get("/all/:managerId", authenticateJWT, getAllCategoriesForManager);

// GET /categories/get/:categoryId
router.get("/get/:categoryId", authenticateJWT, getCategory);

// GET /categories/update
router.put("/update", authenticateJWT, authenticateAccessLevel(["1"]), updateCategory);

// DELETE /categories/delete/:categoryId
router.delete("/delete/:categoryId", authenticateJWT, authenticateAccessLevel(["1"]), deleteCategory);

// DELETE /categories/delete/all/:managerId
router.delete("/delete/all/:managerId", authenticateJWT, authenticateAccessLevel(["1"]), deleteAllCategoriesForManager);

module.exports = router;

