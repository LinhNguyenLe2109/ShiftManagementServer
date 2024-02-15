const { db } = require("./firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} = require("firebase/firestore");
const logger = require("../logger");
const { v4: uuidv4 } = require("uuid");
const verifyString = require("../utils/verifyString");

class ShiftInstance {
  constructor({ id, name, desc, createdBy, parentSchedule, startTime, endTime, employeeId, completed, report}) {
    this.id = id ? id : uuidv4();
    this.name = verifyString(name) ? name : "";
    this.desc = verifyString(desc) ? desc : "";
    this.createdBy = verifyString(createdBy) ? createdBy : "";
    this.parentSchedule = parentSchedule;
    this.startTime = startTime;
    this.endTime = endTime;
    this.employeeId = verifyString(employeeId) ? employeeId : "";
    this.completed = completed;
    //this.location = location
    this.report = verifyString(report) ? report : "";
  }

  getDataForDB() {
    return {
      name: this.name,
      desc: this.desc,
      createdBy: this.createdBy,
      parentSchedule: this.parentSchedule,
      startTime: this.startTime,
      endTime: this.endTime,
      employeeId: this.employeeId,
      completed: this.completed,
      report: this.report,
    };
  }
}

const createShiftInstance = async (shiftInstance) => {
  const shiftInstanceObj = new ShiftInstance(shiftInstance);
  if (!verifyString(categoryObj.name))
    throw new Error("Name is required");
  if (!categoryObj.startTime)
    throw new Error("startTime is required");
  if (!categoryObj.endTime)
    throw new Error("endTime is required");
  //if (!verifyString(categoryObj.employeeId))
  //  throw new Error("employeeId is required");
  logger.info(shiftInstanceObj);
  try {
    const shiftInstanceId = shiftInstanceObj.id;
    await setDoc(doc(db, "shiftInstances", shiftInstanceId), shiftInstanceObj.getDataForDB());
    logger.info(`ShiftInstance created with ID: ${shiftInstanceId}`);
    return await getShiftInstance(shiftInstanceId);
  } catch (e) {
    logger.error(`Error creating ShiftInstance: ${e}`);
    throw e;
  }
};

const getShiftInstance = async (shiftInstanceId) => {
  try {
    const docRef = doc(db, "shiftInstances", shiftInstanceId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.info(`shiftInstance data: ${docSnap.data()}`);
      const id = docSnap.id;
      const data = docSnap.data();
      return { id, ...data };
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error getting shiftInstance: ${e}`);
    throw e;
  }
};

const updateShiftInstance = async (updatedShiftInstance) => {
  try {
    const docRef = doc(db, "shiftInstances", updatedShiftInstance.id);
    const shiftInstance = await getShiftInstance(updatedShiftInstance.id);
    // Verify the category
    if (!verifyString(categoryObj.name))
      updatedShiftInstance.name = shiftInstance.name;
    if (!categoryObj.startTime)
      updatedShiftInstance.startTime = shiftInstance.startTime;
    if (!categoryObj.endTime)
      updatedShiftInstance.endTime = shiftInstance.endTime;
    updatedShiftInstance.createdBy = shiftInstance.createdBy;
    await setDoc(docRef, updatedShiftInstance.getDataForDB(), { merge: true });
    logger.info(`ShiftInstance updated with ID: ${updatedShiftInstance.id}`);
    return updatedShiftInstance;
  } catch (e) {
    logger.error(`Error updating shiftInstance: ${e}`);
    throw e;
  }
};

// delete a category
const deleteShiftInstance = async (shiftInstanceId) => {
  try {
    logger.info(`Deleting shiftInstance with ID: ${shiftInstanceId}`);
    const docRef = doc(db, "shiftInstances", shiftInstanceId);
    await deleteDoc(docRef);
    logger.info(`shiftInstance deleted with ID: ${shiftInstanceId}`);
    return true;
  } catch (e) {
    logger.error(`Error deleting shiftInstance: ${e}`);
    return false;
  }
};

module.exports = {
  ShiftInstance,
  createShiftInstance,
  getShiftInstance,
  updateShiftInstance,
  deleteShiftInstance,
};
