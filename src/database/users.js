const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
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
    accessLevel,
    reportTo,
    employeeList,
  }) {
    this.id = id;
    this.email = email;
    this.lastName = lastName ? lastName : "";
    this.firstName = firstName ? firstName : "";
    this.createdOn = createdOn ? createdOn : new Date();
    // -1 is undefined, 0 is false, 1 is true
    this.active = active ? active : -1;
    // -1 is undefined, 0 is employee, 1 is manager, 2 is admin
    this.accessLevel = accessLevel ? accessLevel : -1;
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
      accessLevel: this.accessLevel,
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
const updateUserInfo = async (userId, user) => {
  logger.info("updateUserInfo called");
  let userUpdatedData = user;
  userUpdatedData.id = userId;
  // logger.info(userUpdatedData);
  // logger.info(userId);
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // logger.info(docSnap.data());
      const userDataFromDb = docSnap.data();
      // Update only the fields that are passed in the request
      if (userUpdatedData.lastName === "") {
        userUpdatedData.lastName = userDataFromDb.lastName;
      }
      if (userUpdatedData.firstName === "") {
        userUpdatedData.firstName = userDataFromDb.firstName;
      }
      if (userUpdatedData.accessLevel === -1) {
        userUpdatedData.accessLevel = userDataFromDb.accessLevel;
      }
      if (userUpdatedData.active === -1) {
        userUpdatedData.active = userDataFromDb.active;
      }
      userUpdatedData.reportTo = userDataFromDb.reportTo;
      userUpdatedData.employeeList = userDataFromDb.employeeList;
      userUpdatedData.createdOn = userDataFromDb.createdOn;
      userUpdatedData.email = userDataFromDb.email;
      logger.info(userUpdatedData.getDataForDB());
      const docRef = await setDoc(
        doc(db, "users", userUpdatedData.getId()),
        userUpdatedData.getDataForDB(),
        { merge: true }
      );
      logger.info(`User updated successfully`);
      const updatedUser = await getUserInfo(userId);
      return updatedUser;
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
  updateUserInfo,
  deleteUser,
  User,
};
