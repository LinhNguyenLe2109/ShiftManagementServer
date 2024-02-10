const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
  deleteDoc,
} = require("firebase/firestore");
const logger = require("../logger");
const { v4: uuidv4 } = require("uuid");
const verifyString = require("../helper/verifyString");

// Only description is optional
class Category {
  constructor({ id, createdBy, name, description }) {
    this.id = id ? id : uuidv4();
    this.name = verifyString(name) ? name : "";
    this.description = verifyString(description) ? description : "";
    this.createdBy = verifyString(createdBy) ? createdBy : "";
  }

  getDataForDB() {
    return {
      name: this.name,
      description: this.description,
      createdBy: this.createdBy,
    };
  }
}

// Create a new category
const createCategory = async (category) => {
  const categoryObj = new Category(category);
  if (!verifyString(categoryObj.createdBy)) {
    throw new Error("Manager ID is required");
  }
  if (!verifyString(categoryObj.name)) {
    throw new Error("Category name is required");
  }
  logger.info(categoryObj);
  try {
    const categoryId = categoryObj.id;
    await setDoc(doc(db, "categories", categoryId), categoryObj.getDataForDB());
    logger.info(`Category created with ID: ${categoryId}`);
    return await getCategory(categoryId);
  } catch (e) {
    logger.error(`Error creating category: ${e}`);
    throw e;
  }
};

// get a category
const getCategory = async (categoryId) => {
  try {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.info(`Category data: ${docSnap.data()}`);
      const id = docSnap.id;
      const data = docSnap.data();
      return { id, ...data };
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error getting category: ${e}`);
    throw e;
  }
};

// Get all categories for a manager
const getAllCategoriesForManager = async (managerId) => {
  try {
    // logger.info(`Getting all categories for manager: ${managerId}`);
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, where("createdBy", "==", managerId));
    const querySnapShot = await getDocs(q);
    const categories = [];
    if (querySnapShot.empty) {
      logger.info(`No categories found for manager: ${managerId}`);
      return null;
    }
    querySnapShot.forEach((doc) => {
      id = doc.id;
      data = doc.data();
      categories.push(new Category({ id, ...data }));
    });
    // logger.info(`Categories data:`);
    // logger.info(categories);
    // logger.info(Array.isArray(categories));
    return categories;
  } catch (e) {
    logger.error(`Error getting categories: ${e}`);
    throw e;
  }
};

// Update a category
const updateCategory = async (updatedCategory) => {
  try {
    const docRef = doc(db, "categories", updatedCategory.id);
    const category = await getCategory(updatedCategory.id);
    // Verify the category
    if (!verifyString(updatedCategory.name)) {
      updatedCategory.name = category.name;
    }
    if (!verifyString(updatedCategory.description)) {
      updatedCategory.description = category.description;
    }
    updatedCategory.createdBy = category.createdBy;
    await setDoc(docRef, updatedCategory.getDataForDB(), { merge: true });
    logger.info(`Category updated with ID: ${updatedCategory.id}`);
    return updatedCategory;
  } catch (e) {
    logger.error(`Error updating category: ${e}`);
    throw e;
  }
};

// delete a category
const deleteCategory = async (categoryId) => {
  try {
    logger.info(`Deleting category with ID: ${categoryId}`);
    const docRef = doc(db, "categories", categoryId);
    await deleteDoc(docRef);
    logger.info(`Category deleted with ID: ${categoryId}`);
    return docRef;
  } catch (e) {
    logger.error(`Error deleting category: ${e}`);
    throw e;
  }
};

const deleteAllCategoriesForManager = async (managerId) => {
  try {
    logger.info("calling deleteAllCategoriesForManager");
    const categories = await getAllCategoriesForManager(managerId);
    if (categories === null) {
      return;
    }
    logger.info(`Categories data:`);
    logger.info(categories);
    for (const category of categories) {
      // logger.info("calling deleteCategory");
      // logger.info(category);
      await deleteCategory(category.id);
    }
    // logger.info(`All Categories deleted for Manager with ID: ${managerId}`);
  } catch (e) {
    logger.error(`Error deleting all categories for manager: ${e}`);
    throw e;
  }
};

module.exports = {
  Category,
  createCategory,
  getAllCategoriesForManager,
  getCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategoriesForManager,
};
