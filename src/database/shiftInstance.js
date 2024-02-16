const { db } = require("./firebase.config");
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
  if (!verifyString(shiftInstanceObj.name))
    throw new Error("Name is required");
  if (!shiftInstanceObj.startTime)
    throw new Error("startTime is required");
  if (!shiftInstanceObj.endTime)
    throw new Error("endTime is required");
  shiftInstanceObj.startTime = shiftInstanceObj.startTime.toISOString();
  shiftInstanceObj.endTime = shiftInstanceObj.endTime.toISOString();
  //if (!verifyString(shiftInstanceObj.employeeId))
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
      logger.info(`shiftInstance data:`);
      logger.info(docSnap.data());
      const id = docSnap.id;
      const data = docSnap.data();
      data.startTime = new Date(data.startTime);
      data.endTime = new Date(data.endTime);
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

const getShiftInstancesFromRange = async (employeeId, start, end) => {
  try {
    const docRef = collection(db, "shiftInstances");
    const q = query(docRef, 
      where("startTime", ">=", start), 
      where("startTime", "<=", end), 
      where("employeeId", "==", employeeId)
    );
    const querySnapShot = await getDocs(q);
    const shiftInstances = [];
    if (querySnapShot.empty) {
      return [];
    }
    querySnapShot.forEach((doc) => {
      id = doc.id;
      data = doc.data();
      data.startTime = new Date(data.startTime);
      data.endTime = new Date(data.endTime);
      shiftInstances.push(new ShiftInstance({ id, ...data }));
    });
    return shiftInstances;
  } catch (e) {
    logger.error(`Error getting shiftInstancesFromRange: ${e}`);
    throw e;
  }
};

const updateShiftInstance = async (updatedShiftInstance) => {
  try {
    const docRef = doc(db, "shiftInstances", updatedShiftInstance.id);
    const shiftInstanceObj = await getShiftInstance(updatedShiftInstance.id);
    // Verify the shiftInstanceObj
    //This will break with bad dates! TODO
    updatedShiftInstance.startTime = updatedShiftInstance.startTime.toISOString();
    updatedShiftInstance.endTime = updatedShiftInstance.endTime.toISOString();
    if (!verifyString(updatedShiftInstance.name))
      updatedShiftInstance.name = shiftInstanceObj.name;
    if (!updatedShiftInstance.startTime)
      updatedShiftInstance.startTime = shiftInstanceObj.startTime;
    if (!updatedShiftInstance.endTime)
      updatedShiftInstance.endTime = shiftInstanceObj.endTime;
    updatedShiftInstance.createdBy = shiftInstanceObj.createdBy;
    await setDoc(docRef, updatedShiftInstance.getDataForDB(), { merge: true });
    logger.info(`ShiftInstance updated with ID: ${updatedShiftInstance.id}`);
    return updatedShiftInstance;
  } catch (e) {
    logger.error(`Error updating shiftInstance: ${e}`);
    throw e;
  }
};

//Prevents parentSchedule, employeeId, report from being cleared. Simpler than retrieving them in some cases
const softUpdateShiftInstance = async (updatedShiftInstance) => {
  try {
    const docRef = doc(db, "shiftInstances", updatedShiftInstance.id);
    const shiftInstanceObj = await getShiftInstance(updatedShiftInstance.id);
    // Verify the shiftInstanceObj
    updatedShiftInstance.startTime = updatedShiftInstance.startTime.toISOString();
    updatedShiftInstance.endTime = updatedShiftInstance.endTime.toISOString();
    if (!verifyString(updatedShiftInstance.name))
      updatedShiftInstance.name = shiftInstanceObj.name;
    if (!updatedShiftInstance.startTime)
      updatedShiftInstance.startTime = shiftInstanceObj.startTime;
    if (!updatedShiftInstance.endTime)
      updatedShiftInstance.endTime = shiftInstanceObj.endTime;
    if (!verifyString(updatedShiftInstance.parentSchedule))
      updatedShiftInstance.parentSchedule = shiftInstanceObj.parentSchedule;
    if (!verifyString(updatedShiftInstance.employeeId))
      updatedShiftInstance.employeeId = shiftInstanceObj.employeeId;
    if (!verifyString(updatedShiftInstance.report))
      updatedShiftInstance.report = shiftInstanceObj.report;
    updatedShiftInstance.createdBy = shiftInstanceObj.createdBy;
    await setDoc(docRef, updatedShiftInstance.getDataForDB(), { merge: true });
    logger.info(`ShiftInstance soft updated with ID: ${updatedShiftInstance.id}`);
    return updatedShiftInstance;
  } catch (e) {
    logger.error(`Error soft updating shiftInstance: ${e}`);
    throw e;
  }
};

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
  softUpdateShiftInstance,
  getShiftInstancesFromRange,
};
