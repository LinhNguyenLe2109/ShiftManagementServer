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
const { verifyString } = require("../utils/verifyString");
const { verifyDate } = require("../utils/verifyDate");
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
    this.id = id ? id : uuidv4();
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
    this.shifts = shiftIdList && Array.isArray(shiftIdList) ? shiftIdList : [];
  }
  addShiftId(shiftId) {
    this.shifts.push(shiftId);
  }
  addMultipleShiftIds(shiftIdList) {
    this.shifts = this.shifts.concat(shiftIdList);
  }
  removeShiftId(shiftId) {
    this.shifts = this.shifts.filter((id) => id !== shiftId);
  }
  removeMultipleShiftIds(shiftIdList) {
    this.shifts = this.shifts.filter((id) => !shiftIdList.includes(id));
  }
  getDetailedShifts = async () => {
    let shifts = [];
    for (let i = 0; i < this.shifts.length; i++) {
      const shift = await getShiftInstance(this.shifts[i]);
      shifts.push(shift);
    }
    return shifts;
  };
}
// createShiftSchedule creates a new shift schedule
// @param shiftSchedule: ShiftSchedule or object
// @returns ShiftSchedule object
const createShiftSchedule = async (shiftSchedule) => {};

// getShiftSchedule gets a shift schedule by its id
// @param shiftScheduleId: string
// @returns ShiftSchedule object
const getShiftSchedule = async (shiftScheduleId) => {};

// getShiftScheduleByDate gets a shift schedule by date (startDate >= date <= endDate)
// @param employeeId: string
// @param date: Date
// @returns ShiftSchedule object
const getShiftSchedulesByDate = async (employeeId, date) => {};

// getShiftSchedules gets all shift schedules for an employee
// @param employeeId: string
// @returns Array of ShiftSchedule objects
const getAllShiftSchedules = async (employeeId) => {};

// updateShiftSchedule updates a shift schedule
// To remove a shift from the shift schedule, use removeShift key
// To remove multiple shifts from the shift schedule, use removeMultipleShifts key
// To add a shift to the shift schedule, use addShift key
// To add multiple shifts to the shift schedule, use addMultipleShifts key
// @param shiftScheduleId: string
// @param updatedShiftScheduleData: object
const updateShiftSchedule = async (
  shiftScheduleId,
  updatedShiftScheduleData
) => {};

// deleteShiftSchedule deletes a shift schedule
// @param shiftScheduleId: string
// @returns boolean
const deleteShiftSchedule = async (shiftScheduleId) => {};

module.exports = {
  createShiftSchedule,
  getShiftSchedule,
  getShiftSchedulesByDate,
  getAllShiftSchedules,
  updateShiftSchedule,
  deleteShiftSchedule,
  ShiftSchedule,
};
