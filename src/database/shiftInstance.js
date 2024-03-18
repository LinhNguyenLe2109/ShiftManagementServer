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
const verifyDate = require("../utils/verifyDate");
const { Timestamp } = require("firebase/firestore");
const { createEmptyReport } = require("./report");

class ShiftInstance {
  // @param {string} id - The id of the shiftInstance
  // @param {string} name - The name of the shiftInstance
  // @param {string} desc - The description of the shiftInstance
  // @param {string} createdBy - The user who created the shiftInstance - will be converted to DateTime
  // @param {string} parentSchedule - The id of the parent schedule
  // @param {string} startTime - The start time of the shiftInstance - will be converted to DateTime
  // @param {string} endTime - The end time of the shiftInstance - will be converted to DateTime
  // @param {string} employeeId - The id of the employee assigned to the shiftInstance
  // @param {boolean} completed - Whether the shiftInstance is completed
  // @param {string} report - The id of the report for the shiftInstance
  // @param {string} location - The location of the shiftInstance
  constructor({
    id,
    name,
    desc,
    createdBy,
    parentSchedule,
    startTime,
    endTime,
    employeeId,
    completed,
    report,
    location,
  }) {
    this.id = id ? id : uuidv4();
    this.name = verifyString(name) ? name : "";
    this.desc = verifyString(desc) ? desc : "";
    this.createdBy = verifyString(createdBy) ? createdBy : "";
    this.parentSchedule = verifyString(parentSchedule) ? parentSchedule : "";
    // check if the date is valid
    // if it is, set it to the date, if not, check if the date is a string
    // if it is, throw an error, if not, set it to the current date
    if (verifyDate(startTime)) {
      this.startTime = new Date(startTime);
    } else if (verifyString(startTime)) {
      throw new Error("Invalid date format for startTime");
    } else {
      throw new Error("Start time is required");
    }
    // Same as above
    if (verifyDate(endTime)) {
      this.endTime = new Date(endTime);
    } else if (verifyString(endTime)) {
      throw new Error("Invalid date format for endTime");
    } else {
      throw new Error("End time is required");
    }
    // employeeId is required
    if (verifyString(employeeId)) {
      this.employeeId = employeeId;
    } else {
      throw new Error("Employee ID is required");
    }
    this.completed =
      completed && typeof completed == "boolean" ? completed : false;
    this.location = verifyString(location) ? location : "";
    this.report = verifyString(report) ? report : "";

    if (!verifyString(createdBy) && !verifyString(parentSchedule)) {
      throw new Error(
        "ShiftInstance must have either a parentSchedule or createdBy"
      );
    }
  }

  getId() {
    return this.id;
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
      location: this.location,
    };
  }
}

// Create a shiftInstance
// @param shiftInstance: object
const createShiftInstance = async (shiftData) => {
  logger.info("Creating shiftInstance");
  // logger.info(shiftData);
  const shiftInstanceObj = new ShiftInstance(shiftData);
  logger.info(shiftInstanceObj);
  try {
    // check if the shiftInstanceObj already exists
    if (await getShiftInstance(shiftInstanceObj.id)) {
      throw new Error("ShiftInstance already exists");
    }
    // create a report instance if it doesn't exist
    if (shiftInstanceObj.report === "") {
      // logger.info("Creating empty report");
      const result = await createEmptyReport(shiftInstanceObj.employeeId);
      // logger.info(result);
      shiftInstanceObj.report = result.report.id;
    }
    logger.info("Skipping report creation");
    const shiftInstanceId = shiftInstanceObj.id;
    await setDoc(
      doc(db, "shiftInstances", shiftInstanceId),
      shiftInstanceObj.getDataForDB()
    );
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
      // logger.info(`shiftInstance data:`);
      // logger.info(docSnap.data());
      const id = docSnap.id;
      const data = docSnap.data();
      data.startTime = data.startTime.toDate();
      data.endTime = data.endTime.toDate();
      return { id, ...data };
    } else {
      logger.error("No such document!");
      return null;
    }
  } catch (e) {
    logger.error(`Error getting shiftInstance: ${e}`);
    throw new Error("Error getting shiftInstance");
  }
};

// Get a list of shiftInstances from a range for a specific employee
// @param employeeId: string
// @param start: Date
// @param end: Date
// @return shiftInstances: array
const getShiftInstancesFromRange = async (employeeId, start, end) => {
  logger.info("Getting shiftInstances from range");
  try {
    const docRef = collection(db, "shiftInstances");
    logger.info("verifying employeeId");
    if (!verifyString(employeeId)) {
      throw new Error("Employee ID is required/invalid");
    }
    logger.info("verifying date");
    if (!verifyDate(start)) {
      throw new Error("Invalid date format for start");
    }
    if (!verifyDate(end)) {
      throw new Error("Invalid date format for end");
    }
    start = Timestamp.fromDate(new Date(start));
    end = Timestamp.fromDate(new Date(end));
    const q = query(
      docRef,
      where("startTime", ">=", start),
      where("startTime", "<=", end),
      where("employeeId", "==", employeeId)
    );
    const querySnapShot = await getDocs(q);
    const shiftInstances = [];
    if (querySnapShot.empty) {
      logger.info("No shiftInstances found");
      return [];
    }
    querySnapShot.forEach((doc) => {
      id = doc.id;
      data = doc.data();
      data.startTime = data.startTime.toDate();
      data.endTime = data.endTime.toDate();
      shiftInstances.push(new ShiftInstance({ id, ...data }));
    });
    logger.info(`List of shiftInstances:`);
    logger.info(shiftInstances);
    return shiftInstances;
  } catch (e) {
    logger.error(`Error getting shiftInstancesFromRange: ${e}`);
    throw new Error("Error getting shiftInstancesFromRange:" + e);
  }
};

// Update a shiftInstance
// @param shiftInstanceId: string
// @param updatedShiftInstance: object
// @return updatedShiftInstance: shiftInstance object
const updateShiftInstance = async (
  shiftInstanceId,
  updatedShiftInstanceData
) => {
  try {
    const docRef = doc(db, "shiftInstances", shiftInstanceId);
    const shiftInstanceObj = new ShiftInstance(
      await getShiftInstance(shiftInstanceId)
    );
    // check if the passing object has startTime
    if (
      updatedShiftInstanceData.hasOwnProperty("startTime") &&
      verifyDate(updatedShiftInstanceData.startTime)
    ) {
      shiftInstanceObj.startTime = new Date(updatedShiftInstanceData.startTime);
    }
    // check if the passing object has endTime
    if (
      updatedShiftInstanceData.hasOwnProperty("endTime") &&
      verifyDate(updatedShiftInstanceData.endTime)
    ) {
      shiftInstanceObj.endTime = new Date(updatedShiftInstanceData.endTime);
    }
    // check if the passing object has name
    if (verifyString(updatedShiftInstanceData.name))
      shiftInstanceObj.name = updatedShiftInstanceData.name;
    // check if the passing object has desc
    if (verifyString(updatedShiftInstanceData.desc))
      shiftInstanceObj.desc = updatedShiftInstanceData.desc;
    // check if the passing object has location
    if (verifyString(updatedShiftInstanceData.location))
      shiftInstanceObj.location = updatedShiftInstanceData.location;
    // check if the passing object has employeeId
    if (verifyString(updatedShiftInstanceData.employeeId))
      shiftInstanceObj.employeeId = updatedShiftInstanceData.employeeId;
    // check if the object is completed
    if (
      updatedShiftInstanceData.hasOwnProperty("completed") &&
      typeof updatedShiftInstanceData.completed == "boolean"
    ) {
      shiftInstanceObj.completed = updatedShiftInstanceData.completed;
    }
    // check if the passing object has a new report id
    if (verifyString(updatedShiftInstanceData.report))
      shiftInstanceObj.report = updatedShiftInstanceData.report;

    await setDoc(docRef, shiftInstanceObj.getDataForDB(), { merge: true });
    logger.info(`ShiftInstance updated with ID: ${shiftInstanceObj.id}`);
    return shiftInstanceObj;
  } catch (e) {
    logger.error(`Error updating shiftInstance: ${e}`);
    throw e;
  }
};

const deleteShiftInstance = async (shiftInstanceId) => {
  try {
    logger.info(`Deleting shiftInstance with ID: ${shiftInstanceId}`);
    const shiftInstance = await getShiftInstance(shiftInstanceId);
    if (!shiftInstance) {
      return false;
    }
    // if created by is empty, delete the shiftInstance id from shiftSchedule
    if (shiftInstance.createdBy === "") {
      // TODO
    }
    // if parentSchedule is empty, delete the shiftInstance id from manager instance
    if (shiftInstance.parentSchedule === "") {
      // TODO
    }
    // TODO: remove report

    //Prevents parentSchedule, employeeId, report from being cleared. Simpler than retrieving them in some cases
    // const softUpdateShiftInstance = async (updatedShiftInstance) => {
    //   try {
    //     const docRef = doc(db, "shiftInstances", updatedShiftInstance.id);
    //     const shiftInstanceObj = await getShiftInstance(updatedShiftInstance.id);
    //     // Verify the shiftInstanceObj
    //     updatedShiftInstance.startTime = updatedShiftInstance.startTime.toISOString();
    //     updatedShiftInstance.endTime = updatedShiftInstance.endTime.toISOString();
    //     if (!verifyString(updatedShiftInstance.name))
    //       updatedShiftInstance.name = shiftInstanceObj.name;
    //     if (!updatedShiftInstance.startTime)
    //       updatedShiftInstance.startTime = shiftInstanceObj.startTime;
    //     if (!updatedShiftInstance.endTime)
    //       updatedShiftInstance.endTime = shiftInstanceObj.endTime;
    //     if (!verifyString(updatedShiftInstance.parentSchedule))
    //       updatedShiftInstance.parentSchedule = shiftInstanceObj.parentSchedule;
    //     if (!verifyString(updatedShiftInstance.employeeId))
    //       updatedShiftInstance.employeeId = shiftInstanceObj.employeeId;
    //     if (!verifyString(updatedShiftInstance.report))
    //       updatedShiftInstance.report = shiftInstanceObj.report;
    //     updatedShiftInstance.createdBy = shiftInstanceObj.createdBy;
    //     await setDoc(docRef, updatedShiftInstance.getDataForDB(), { merge: true });
    //     logger.info(`ShiftInstance soft updated with ID: ${updatedShiftInstance.id}`);
    //     return updatedShiftInstance;
    //   } catch (e) {
    //     logger.error(`Error soft updating shiftInstance: ${e}`);
    //     throw e;
    //   }
    // };

    //Manager needs a deranged dependency injection D:<
    // const deleteShiftInstance = async (shiftInstanceId, Manager, updateManager) => {
    //   try {
    //     logger.info(`Deleting shiftInstance with ID: ${shiftInstanceId}`);
    //     for (const x of await getShiftParentManagers(shiftInstanceId, Manager)) {
    //       await updateManager(x.id, {removeUnassignedShift: shiftInstanceId})
    //     }
    const docRef = doc(db, "shiftInstances", shiftInstanceId);
    await deleteDoc(docRef);
    // logger.info(`shiftInstance deleted with ID: ${shiftInstanceId}`);
    return true;
  } catch (e) {
    logger.error(`Error deleting shiftInstance: ${e}`);
    return false;
  }
};

//return array of manager objects that reference shift id
const getShiftParentManagers = async (id, Manager) => {
  try {
    const docRef = collection(db, "managers");
    const q = query(docRef, where("unassignedShifts", "array-contains", id));
    const querySnapShot = await getDocs(q);
    const managers = [];
    if (querySnapShot.empty) {
      return [];
    }
    querySnapShot.forEach((doc) => {
      const data = doc.data();
      managers.push(new Manager({ id, ...data }));
    });
    return managers;
  } catch (e) {
    logger.error(`Error in getShiftParentManagers: ${e}`);
    throw e;
  }
};

module.exports = {
  ShiftInstance,
  createShiftInstance,
  getShiftInstance,
  updateShiftInstance,
  deleteShiftInstance,
  getShiftInstancesFromRange,
  getShiftParentManagers,
};
