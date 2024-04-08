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
const { getShiftInstance } = require("./shiftInstance");
class ShiftScheduleTemplate {
  constructor({ id, archived, shiftIdList, desc, employeeId }) {
    this.id = id && verifyString(id) ? id : uuidv4();
    this.desc = verifyString(desc) ? desc : "";
    if (verifyString(employeeId))
      this.employeeId = employeeId;
    else
      throw new Error("Employee ID is required");
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
      employeeId: this.employeeId,
    };
  };
}

const createShiftScheduleTemplate = async (shiftSchedule) => {
  try {
    const shiftScheduleObj = new ShiftScheduleTemplate(shiftSchedule);
    const shiftScheduleId = shiftScheduleObj.id;
    const shiftScheduleData = shiftScheduleObj.getDataForDb();
    if (await getShiftScheduleTemplate(shiftScheduleId)) {
      throw new Error("Shift schedule already exists");
    }
    await setDoc(doc(db, "shiftScheduleTemplates", shiftScheduleId), shiftScheduleData);
    return await getShiftScheduleTemplate(shiftScheduleId);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const getShiftScheduleTemplate = async (shiftScheduleId) => {
  try {
    const shiftScheduleRef = doc(db, "shiftScheduleTemplates", shiftScheduleId);
    const shiftScheduleSnap = await getDoc(shiftScheduleRef);
    if (shiftScheduleSnap.exists()) {
      const shiftScheduleData = shiftScheduleSnap.data();
      const shiftScheduleId = shiftScheduleSnap.id;
      return { id: shiftScheduleId, ...shiftScheduleData };
    }
    return null;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const getShiftScheduleTemplateFor = async (employeeId) => {
  try {
    const shiftSchedulesRef = collection(db, "shiftScheduleTemplates");
    const q = query(shiftSchedulesRef, where("employeeId", "==", employeeId));
    const shiftSchedulesSnap = await getDocs(q);
    const shiftSchedules = [];
    shiftSchedulesSnap.forEach((doc) => {
      const shiftScheduleData = doc.data();
      const shiftScheduleId = doc.id;
      shiftSchedules.push({ id: shiftScheduleId, ...shiftScheduleData });
    });
    return shiftSchedules[0]; //lazy
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const updateShiftScheduleTemplate = async (
  shiftScheduleId,
  updatedShiftScheduleData
) => {
  try {
    const shiftScheduleRef = doc(db, "shiftScheduleTemplates", shiftScheduleId);
    const shiftScheduleSnap = await getDoc(shiftScheduleRef);
    if (!shiftScheduleSnap.exists()) {
      throw new Error("Shift schedule template does not exist");
    }
    const shiftScheduleData = shiftScheduleSnap.data();
    const shiftSchedule = new ShiftScheduleTemplate({
      id: shiftScheduleId,
      archived: shiftScheduleData.archived,
      shiftIdList: shiftScheduleData.shiftIdList,
      desc: shiftScheduleData.desc,
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
    if (updatedShiftScheduleData.hasOwnProperty("archived")) {
      shiftSchedule.archived = updatedShiftScheduleData.archived;
    }
    const updatedShiftSchedule = shiftSchedule.getDataForDb();
    await setDoc(shiftScheduleRef, updatedShiftSchedule);
    return await getShiftScheduleTemplate(shiftScheduleId);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const deleteShiftScheduleTemplate = async (shiftScheduleId) => {
  try {
    if (!(await getShiftScheduleTemplate(shiftScheduleId))) {
      return false;
    }
    const shiftScheduleRef = doc(db, "shiftScheduleTemplates", shiftScheduleId);
    await deleteDoc(shiftScheduleRef);
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

const getScheduleTemplateShifts = async (shiftScheduleId) => {
  try {
    const shiftScheduleRef = doc(db, "shiftScheduleTemplates", shiftScheduleId);
    const shiftScheduleSnap = await getDoc(shiftScheduleRef);
    if (!shiftScheduleSnap.exists())
      return null;
    const shiftScheduleShiftIds = shiftScheduleSnap.data().shiftIdList;
    const promises = [];
    shiftScheduleShiftIds.forEach(id => promises.push(getShiftInstance(id)));
    return await Promise.all(promises);
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports = {
  createShiftScheduleTemplate,
  getShiftScheduleTemplate,
  getShiftScheduleTemplateFor,
  updateShiftScheduleTemplate,
  deleteShiftScheduleTemplate,
  getScheduleTemplateShifts,
  ShiftScheduleTemplate,
};
