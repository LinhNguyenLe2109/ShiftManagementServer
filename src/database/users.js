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
const verifyString = require("../utils/verifyString");
const { removeUserFromAuthDb } = require("../database/authentication");

class User {
  constructor({
    id,
    email,
    lastName,
    firstName,
    createdOn,
    active,
    accessLevel,
    accountInfo,
    notificationList,
  }) {
    this.id = id;
    this.email = email;
    this.lastName = verifyString(lastName) ? lastName : "";
    this.firstName = verifyString(firstName) ? firstName : "";
    this.createdOn = createdOn ? createdOn : new Date();
    // -1 is undefined, 0 is false, 1 is true
    this.active = active ? active : -1;
    // -1 is undefined, 0 is employee, 1 is manager, 2 is admin
    this.accessLevel =
      accessLevel && typeof accessLevel == "number" ? accessLevel : -1;
    this.accountInfo = verifyString(accountInfo) ? accountInfo : "";
    this.notificationList = Array.isArray(notificationList)
      ? notificationList
      : [];
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
      accountInfo: this.accountInfo,
      notificationList: this.notificationList,
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
    return true;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    return false;
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
      const id = docSnap.id;
      const data = docSnap.data();
      return { id, ...data };
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
// @param userId: string
// @param user: User class
// @return user: User class
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
    // remove user document in the collection
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef);
    logger.info(`User deleted successfully: ${docRef}`);
    // remove user from auth db
    if (!(await removeUserFromAuthDb(userId))) {
      logger.error(`Error deleting user from auth db: ${userId}`);
      return false;
    }
    return true;
  } catch (e) {
    logger.error(`Error deleting user: ${e}`);
    return false;
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
