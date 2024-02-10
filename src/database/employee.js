const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const logger = require("../logger");

class Employee {
  constructor({ reportTo, scheduleTemplateId, scheduleList, category }) {
    this.reportTo = reportTo ? reportTo : "";
    this.scheduleTemplateId = scheduleTemplateId ? scheduleTemplateId : "";
    this.scheduleList = scheduleList ? scheduleList : [];
    this.category = category && typeof category == "number" ? category : -1;
  }

  getCategory() {
    return this.category;
  }
}

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

module.exports = { Employee, getUpperManager };
