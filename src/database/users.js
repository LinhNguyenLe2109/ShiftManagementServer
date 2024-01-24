const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const logger = require("../logger");

class User {
  constructor({
    id,
    email,
    lastName,
    firstName,
    createdOn,
    active,
    type,
    reportTo,
    employeeList,
  }) {
    this.id = id;
    this.email = email;
    this.lastName = lastName ? lastName : "";
    this.firstName = firstName ? firstName : "";
    this.createdOn = createdOn ? createdOn : new Date();
    this.active = active ? active : true;
    this.type = type ? this.type : 0;
    this.reportTo = reportTo ? reportTo : "";
    this.employeeList = employeeList ? employeeList : [];
  }

  getId() {
    return this.id;
  }
  getDataForDB() {
    return {
      email: this.email,
      lastName: this.lastName,
      firstName: this.firstName,
      createdOn: this.createdOn,
      active: this.active,
      type: this.type,
      reportTo: this.reportTo,
      employeeList: this.employeeList,
    };
  }
}

// Create a new user profile
const createUser = async (user) => {
  const userObj = new User(user);
  logger.info(userObj);
  try {
    const userId = userObj.getId();
    const docRef = await setDoc(
      doc(db, "users", userId),
      userObj.getDataForDB()
    );
    logger.info(`User created successfully: ${docRef}`);
    return docRef;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    throw e;
  }
};

// Get a user profile
const getUserInfo = async (userId) => {
  logger.info("getUserInfo called");
  try {
    logger.debug("User id:" + userId);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.info(docSnap.data());
      return docSnap.data();
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error getting user: ${e}`);
    throw e;
  }
};

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

// Get upper manager of a user
const getUpperManager = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.info(`User data: ${docSnap.data()}`);
      const managerId = docSnap.data().reportTo;
      const managerRef = doc(db, "users", managerId);
      const managerSnap = await getDoc(managerRef);
      if (managerSnap.exists()) {
        logger.info(`Manager data: ${managerSnap.data()}`);
        return managerSnap.data();
      } else {
        logger.error("No such document!");
        return null;
      }
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error getting user: ${e}`);
    throw e;
  }
};

// Update a user profile
const updateUser = async (userId, user) => {
  const userObj = new User(user);
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.info(`User data: ${docSnap.data()}`);
      const docRef = await setDoc(
        doc(db, "users", userObj.getId),
        userObj.getDataForDB(),
        { merge: true }
      );
      logger.info(`User updated successfully: ${docRef}`);
      return docRef;
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error updating user: ${e}`);
    throw e;
  }
};

// Delete a user profile
const deleteUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef);
    logger.info(`User deleted successfully: ${docRef}`);
    return docRef;
  } catch (e) {
    logger.error(`Error deleting user: ${e}`);
    throw e;
  }
};

module.exports = {
  getUpperManager,
  getUsersByManager,
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
};
