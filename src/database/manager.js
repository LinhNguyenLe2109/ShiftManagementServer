const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const logger = require("../logger");

class Manager {
  constructor({ employeeList, categoryList, unassignedShifts }) {
    this.employeeList = employeeList ? employeeList : [];
    this.categoryList = categoryList ? categoryList : [];
    this.unassignedShifts = unassignedShifts ? unassignedShifts : [];
  }
}

// Get all users under a manager
const getUsersByManager = async (managerId) => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().reportTo === managerId) {
        users.push(doc.data());
      }
    });
    logger.info(`Users data: ${users}`);
    return users;
  } catch (e) {
    logger.error(`Error getting users: ${e}`);
    throw e;
  }
};
