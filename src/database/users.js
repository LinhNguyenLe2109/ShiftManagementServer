const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc, deleteDoc } = require("firebase/firestore");
const logger = require("../logger");
const verifyString = require("../utils/verifyString");
const { removeUserFromAuthDb } = require("../database/authentication");
const { v4: uuidv4 } = require("uuid");
const { deleteAdmin, createAdmin, getAdmin } = require("../database/admin");
const {
  deleteManager,
  createManager,
  getManager,
} = require("../database/manager");
const {
  deleteEmployee,
  createEmployee,
  getEmployee,
} = require("../database/employee");

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
    this.accountInfo = verifyString(accountInfo) ? accountInfo : uuidv4();
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
// @param user: User class
// @return boolean
const createUser = async (user) => {
  const userObj = new User(user);
  logger.info("createUser called");
  logger.info(userObj);
  try {
    const userId = userObj.getId();
    // return false if accessLevel is not defined
    if (userObj.accessLevel == -1) {
      return false;
    }
    // Check if user already exists
    if (await getUserInfo(userId)) {
      return false;
    }
    const docRef = await setDoc(
      doc(db, "users", userId),
      userObj.getDataForDB()
    );
    if (userObj.accessLevel == 2) {
      await createAdmin(userId);
    }
    if (userObj.accessLevel == 1) {
      await createManager(userId);
    }
    if (userObj.accessLevel == 0) {
      await createEmployee(userId);
    }
    return true;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    return false;
  }
};

// Get a user profile
// @param userId: string
// @return user: User class
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
      data.createdOn = data.createdOn.toDate();
      if (data.accessLevel == 2) {
        data.accountInfo = await getAdmin(userId);
      }
      if (data.accessLevel == 1) {
        data.accountInfo = await getManager(userId);
      }
      if (data.accessLevel == 0) {
        data.accountInfo = await getEmployee(userId);
      }
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
// This is not used for updating the user's account info, email, notification list, or createdOn
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
      userUpdatedData.createdOn = userDataFromDb.createdOn;
      userUpdatedData.email = userDataFromDb.email;
      userUpdatedData.accountInfo = userDataFromDb.accountInfo;
      userUpdatedData.notificationList = userDataFromDb.notificationList;
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
    const user = getUserInfo(userId);
    let successfulDeleteCheck = true;
    if (user.accessLevel == 2) {
      successfulDeleteCheck = await deleteAdmin(userId);
    }
    if (user.accessLevel == 1) {
      successfulDeleteCheck = await deleteManager(userId);
    }
    if (user.accessLevel == 0) {
      successfulDeleteCheck = await deleteEmployee(userId);
    }
    if (!successfulDeleteCheck) {
      logger.error(`Error deleting sub collections`);
      return false;
    }
    // remove user document in the collection
    const docRef = doc(db, "users", userId);
    await deleteDoc(docRef);
    logger.info(`User deleted successfully: ${userId}`);
    // remove user from auth db
    if (!(await removeUserFromAuthDb(userId))) {
      logger.error(`Error deleting user from auth db: ${userId}`);
      return false;
    }
    logger.info(`User deleted from auth db: ${userId}`);
    return true;
  } catch (e) {
    logger.error(`Error deleting user: ${e}`);
    return false;
  }
};

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  deleteUser,
  User,
};
