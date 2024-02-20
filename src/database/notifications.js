const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc, query, where, getDocs, collection, deleteDoc } = require("firebase/firestore");
const logger = require("../logger");
const { v4: uuidv4 } = require("uuid");
const verifyString = require("../utils/verifyString");

class Notification {
  constructor({ id, createdBy, title, content }) {
    this.id = id ? id : uuidv4();
    this.title = verifyString(title) ? title : "";
    this.content = verifyString(content) ? content : "";
    this.createdBy = verifyString(createdBy) ? createdBy : "";
  }

  getDataForDB() {
    return {
      title: this.title,
      content: this.content,
      createdBy: this.createdBy,
    };
  }
}

const createNotification = async (notification) => {
  const notificationObj = new Notification(notification);
  if (!verifyString(notificationObj.createdBy)) {
    throw new Error("Created By is required");
  }
  if (!verifyString(notificationObj.title)) {
    throw new Error("Notification title is required");
  }
  logger.info(notificationObj);
  try {
    const notificationId = notificationObj.id;
    await setDoc(doc(db, "notifications", notificationId), notificationObj.getDataForDB());
    logger.info(`Notification created with ID: ${notificationId}`);
    return await getNotification(notificationId);
  } catch (e) {
    logger.error(`Error creating notification: ${e}`);
    throw e;
  }
};

const getNotification = async (notificationId) => {
  try {
    const docRef = doc(db, "notifications", notificationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.info(`Notification data: ${docSnap.data()}`);
      const id = docSnap.id;
      const data = docSnap.data();
      return { id, ...data };
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error getting notification: ${e}`);
    throw e;
  }
};

const deleteNotification = async (notificationId) => {
    try {
      logger.info(`Deleting notification with ID: ${notificationId}`);
      const docRef = doc(db, "notifications", notificationId);
      await deleteDoc(docRef);
      logger.info(`Notification deleted with ID: ${notificationId}`);
      return true;
    } catch (e) {
      logger.error(`Error deleting notification: ${e}`);
      return false;
    }
  };
  
  module.exports = {
    Notification,
    createNotification,
    getNotification,
    deleteNotification,
  };