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
const { getShiftInstance } = require("./shiftInstance");
class ShiftSchedule {
  // ShiftSchedule class
  // @param id: string
  // @param archived: boolean
  // @param shiftIdList: Array of strings
  // @param desc: string
  // @param startTime: Date
  // @param employeeId: string
  constructor({ id, archived, shiftIdList, desc, startTime, employeeId }) {
    this.id = id && verifyString(id) ? id : uuidv4();
    this.desc = verifyString(desc) ? desc : "";
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
    this.endTime = new Date(this.startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    // employeeId is required
    if (verifyString(employeeId)) {
      this.employeeId = employeeId;
    } else {
      throw new Error("Employee ID is required");
    }
    this.archived = archived && typeof archived == "boolean" ? archived : false;
    this.shiftIdList =
      shiftIdList && Array.isArray(shiftIdList) ? shiftIdList : [];
  }
  addShiftId(shiftId) {
    this.shiftIdList.push(shiftId);
  }
  addMultipleShiftIds(shiftIdList) {
    this.shiftIdList = this.shiftIdList.concat(shiftIdList);
  }
  removeShiftId(shiftId) {
    this.shiftIdList = this.shiftIdList.filter((id) => id !== shiftId);
  }
  removeMultipleShiftIds(shiftIdList) {
    this.shiftIdList = this.shiftIdList.filter(
      (id) => !shiftIdList.includes(id)
    );
  }
  getDetailedShifts = async () => {
    let shifts = [];
    for (let i = 0; i < this.shiftIdList.length; i++) {
      const shift = await getShiftInstance(this.shiftIdList[i]);
      shifts.push(shift);
    }
    return shifts;
  };

  getDataForDb = () => {
    return {
      archived: this.archived,
      shiftIdList: this.shiftIdList,
      desc: this.desc,
      startTime: Timestamp.fromDate(this.startTime),
      endTime: Timestamp.fromDate(this.endTime),
      employeeId: this.employeeId,
    };
  };
}
// createShiftSchedule creates a new shift schedule
// @param shiftSchedule: ShiftSchedule or object
// @returns ShiftSchedule object
const createShiftSchedule = async (shiftSchedule) => {
  try {
    const shiftScheduleObj = new ShiftSchedule(shiftSchedule);
    const shiftScheduleId = shiftScheduleObj.id;
    const shiftScheduleData = shiftScheduleObj.getDataForDb();
    if (await getShiftSchedule(shiftScheduleId)) {
      throw new Error("Shift schedule already exists");
    }
    await setDoc(doc(db, "shiftSchedules", shiftScheduleId), shiftScheduleData);
    return await getShiftSchedule(shiftScheduleId);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

// getShiftSchedule gets a shift schedule by its id
// @param shiftScheduleId: string
// @returns ShiftSchedule object
const getShiftSchedule = async (shiftScheduleId) => {
  try {
    const shiftScheduleRef = doc(db, "shiftSchedules", shiftScheduleId);
    const shiftScheduleSnap = await getDoc(shiftScheduleRef);
    if (shiftScheduleSnap.exists()) {
      const shiftScheduleData = shiftScheduleSnap.data();
      const shiftScheduleId = shiftScheduleSnap.id;
      shiftScheduleData.startTime = shiftScheduleData.startTime.toDate();
      shiftScheduleData.endTime = shiftScheduleData.endTime.toDate();
      return { id: shiftScheduleId, ...shiftScheduleData };
    }
    return null;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

// getShiftScheduleByDate gets a shift schedule by date (startDate >= date <= endDate)
// @param employeeId: string
// @param date: Date
// @returns ShiftSchedule object
const getShiftSchedulesByDate = async (employeeId, date) => {
  try {
    if (!verifyDate(date)) {
      throw new Error("Invalid date");
    }
    const shiftSchedulesRef = collection(db, "shiftSchedules");
    const q = query(
      shiftSchedulesRef,
      where("employeeId", "==", employeeId),
      where("startTime", "<=", Timestamp.fromDate(date)),
      where(
        "startTime",
        ">=",
        Timestamp.fromDate(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000))
      )
    );
    const shiftSchedulesSnap = await getDocs(q);
    if (shiftSchedulesSnap.empty) {
      return null;
    }
    const shiftScheduleData = shiftSchedulesSnap.docs[0].data();
    shiftScheduleData.startTime = shiftScheduleData.startTime.toDate();
    shiftScheduleData.endTime = shiftScheduleData.endTime.toDate();
    const shiftScheduleId = shiftSchedulesSnap.docs[0].id;
    return { id: shiftScheduleId, ...shiftScheduleData };
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

// getShiftSchedules gets all shift schedules for an employee
// @param employeeId: string
// @returns Array of ShiftSchedule objects
const getAllShiftSchedules = async (employeeId) => {
  try {
    const shiftSchedulesRef = collection(db, "shiftSchedules");
    const q = query(shiftSchedulesRef, where("employeeId", "==", employeeId));
    const shiftSchedulesSnap = await getDocs(q);
    const shiftSchedules = [];
    shiftSchedulesSnap.forEach((doc) => {
      const shiftScheduleData = doc.data();
      shiftScheduleData.startTime = shiftScheduleData.startTime.toDate();
      shiftScheduleData.endTime = shiftScheduleData.endTime.toDate();
      const shiftScheduleId = doc.id;
      shiftSchedules.push({ id: shiftScheduleId, ...shiftScheduleData });
    });
    return shiftSchedules;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

// updateShiftSchedule updates a shift schedule
// To remove a shift from the shift schedule, use removeShift key
// To remove multiple shifts from the shift schedule, use removeMultipleShifts key
// To add a shift to the shift schedule, use addShift key
// To add multiple shifts to the shift schedule, use addMultipleShifts key
// @param shiftScheduleId: string
// @param updatedShiftScheduleData: object
// @returns ShiftSchedule object
const updateShiftSchedule = async (
  shiftScheduleId,
  updatedShiftScheduleData
) => {
  try {
    const shiftScheduleRef = doc(db, "shiftSchedules", shiftScheduleId);
    const shiftScheduleSnap = await getDoc(shiftScheduleRef);
    if (!shiftScheduleSnap.exists()) {
      throw new Error("Shift schedule does not exist");
    }
    const shiftScheduleData = shiftScheduleSnap.data();
    const shiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: shiftScheduleData.archived,
      shiftIdList: shiftScheduleData.shiftIdList,
      desc: shiftScheduleData.desc,
      startTime: shiftScheduleData.startTime.toDate(),
      employeeId: shiftScheduleData.employeeId,
    });
    if (updatedShiftScheduleData.hasOwnProperty("removeShift")) {
      shiftSchedule.removeShiftId(updatedShiftScheduleData.removeShift);
    }
    if (updatedShiftScheduleData.hasOwnProperty("removeMultipleShifts")) {
      shiftSchedule.removeMultipleShiftIds(
        updatedShiftScheduleData.removeMultipleShifts
      );
    }
    if (updatedShiftScheduleData.hasOwnProperty("addShift")) {
      shiftSchedule.addShiftId(updatedShiftScheduleData.addShift);
    }
    if (updatedShiftScheduleData.hasOwnProperty("addMultipleShifts")) {
      shiftSchedule.addMultipleShiftIds(
        updatedShiftScheduleData.addMultipleShifts
      );
    }

    if (updatedShiftScheduleData.hasOwnProperty("desc")) {
      shiftSchedule.desc = updatedShiftScheduleData.desc;
    }
    if (updatedShiftScheduleData.hasOwnProperty("startTime")) {
      shiftSchedule.startTime = updatedShiftScheduleData.startTime;
      shiftSchedule.endTime = new Date(
        shiftSchedule.startTime.getTime() + 7 * 24 * 60 * 60 * 1000
      );
    }

    if (updatedShiftScheduleData.hasOwnProperty("archived")) {
      shiftSchedule.archived = updatedShiftScheduleData.archived;
    }
    const updatedShiftSchedule = shiftSchedule.getDataForDb();
    await setDoc(shiftScheduleRef, updatedShiftSchedule);
    return await getShiftSchedule(shiftScheduleId);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

// deleteShiftSchedule deletes a shift schedule
// @param shiftScheduleId: string
// @returns boolean
const deleteShiftSchedule = async (shiftScheduleId) => {
  try {
    if (!(await getShiftSchedule(shiftScheduleId))) {
      return false;
    }
    const shiftScheduleRef = doc(db, "shiftSchedules", shiftScheduleId);
    await deleteDoc(shiftScheduleRef);
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

module.exports = {
  createShiftSchedule,
  getShiftSchedule,
  getShiftSchedulesByDate,
  getAllShiftSchedules,
  updateShiftSchedule,
  deleteShiftSchedule,
  ShiftSchedule,
};
