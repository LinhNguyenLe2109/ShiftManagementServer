const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} = require("firebase/firestore");
const logger = require("../logger");
const verifyString = require("../utils/verifyString");
const { getUserInfo } = require("../database/users");
const { v4: uuidv4 } = require("uuid");
const verifyNumber = require("../utils/verifyNumber");

// Receive id from User class
// Generate schedule template id for scheduleTemplate class
class Employee {
  constructor({ id, reportTo, scheduleTemplateId, scheduleList, category }) {
    this.id = id;
    this.reportTo = verifyString(reportTo) ? reportTo : "";
    this.scheduleTemplateId = verifyString(scheduleTemplateId)
      ? scheduleTemplateId
      : uuidv4();
    this.scheduleList = scheduleList ? scheduleList : [];
    this.category =
      verifyNumber(category) && typeof category == "number" ? category : -1;
    // logger.debug(this.category);
  }

  getScheduleTemplate = async () => {
    console.log("scheduleTemplateId: ", this.scheduleTemplateId);
  };

  getUpperManager = async () => {
    console.log("this.id: ", this.reportTo);
    const manager = await getUserInfo(this.reportTo);
    return manager;
  };

  setUpperManager = async (managerId) => {
    this.reportTo = managerId;
  };

  getCategory = async () => {
    console.log("this.category: ", this.category);
    const category = getCategory(this.category);
    return { name: category.name, description: category.description };
  };

  setCategory = async (categoryId) => {
    this.category = categoryId;
  };

  getScheduleList = async () => {
    // fetch a list of schedules and return an array
    return this.scheduleList;
  };

  addSchedule = async (scheduleId) => {
    this.scheduleList.push(scheduleId);
  };

  addMultipleSchedules = async (scheduleIds) => {
    this.scheduleList = this.scheduleList.concat(scheduleIds);
  };

  getDetailedEmployeeInfo = async () => {
    const id = this.id;
    const manager = await this.getUpperManager();
    const category = await this.getCategory();
    const scheduleList = await this.getScheduleList();
    const scheduleTemplate = await this.getScheduleTemplate();
    return {
      id,
      manager,
      category,
      scheduleList,
      scheduleTemplate,
    };
  };
}

const createEmployee = async (accountInfo, managerId) => {
  try {
    logger.debug("Inside createEmployee");
    logger.debug(JSON.stringify(accountInfo));
    logger.debug(JSON.stringify(managerId));
    if (await getEmployee(accountInfo)) {
      throw new Error("Employee already exists");
    } else {
      await setDoc(doc(db, "employees", accountInfo), {
        reportTo: managerId ? managerId : "",
        scheduleTemplateId: uuidv4(),
        scheduleList: [],
        category: -1,
      });
      const employee = new Employee({ id: accountInfo, reportTo: managerId });
      logger.debug("Employee created: " + JSON.stringify(employee));
      return employee;
    }
  } catch (e) {
    logger.error(`Error creating employee: ${e}`);
    throw e;
  }
};

const getEmployee = async (accountInfo) => {
  try {
    // logger.debug("Inside getEmployee " + accountInfo);
    const docRef = doc(db, "employees", accountInfo);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      logger.debug("Employee found");
      const id = docSnap.id;
      const data = docSnap.data();
      // logger.debug("Employee data: " + JSON.stringify(data));
      return new Employee({ id, ...data });
      // const employee = new Employee({ id, ...data });
      // return employee.getDetailedEmployeeInfo();
    } else {
      return null;
    }
  } catch (e) {
    logger.error(`Error getting employee: ${e}`);
    throw e;
  }
};

// Update an employee
// To add a schedule, use addSchedule key
// To add multiple schedules, use addMultipleSchedules key
// To remove a schedule, use removeSchedule key
// To remove multiple schedules, use removeMultipleSchedules key
// To update the reportTo, use reportTo key
// To update the scheduleTemplateId, use scheduleTemplateId key
// To update the category, use category key
// @param employeeId: string
// @param updatedEmployee: object
const updateEmployee = async (employeeId, updatedData) => {
  const employee = await getEmployee(employeeId);
  // logger.debug("Employee: " + JSON.stringify(employee));
  // logger.debug('Updated Data: ' + JSON.stringify(updatedData));
  if (updatedData.hasOwnProperty("reportTo")) {
    employee.reportTo = updatedData.reportTo;
  }
  if (updatedData.hasOwnProperty("scheduleTemplateId")) {
    employee.scheduleTemplateId = updatedData.scheduleTemplateId;
  }
  if (updatedData.hasOwnProperty("category")) {
    employee.setCategory(updatedData.category);
  }
  if (updatedData.hasOwnProperty("addSchedule")) {
    employee.addSchedule(updatedData.addSchedule);
  }
  if (updatedData.hasOwnProperty("addMultipleSchedules")) {
    employee.addMultipleSchedules(updatedData.addSchedule);
  }
  if (updatedData.hasOwnProperty("removeSchedule")) {
    const index = employee.scheduleList.indexOf(updatedData.removeSchedule);
    if (index > -1) {
      employee.scheduleList.splice(index, 1);
    }
  }
  if (updatedData.hasOwnProperty("removeMultipleSchedules")) {
    for (let i = 0; i < updatedData.removeMultipleSchedules.length; i++) {
      const index = employee.scheduleList.indexOf(
        updatedData.removeMultipleSchedules[i]
      );
      if (index > -1) {
        employee.scheduleList.splice(index, 1);
      }
    }
  }
  try {
    const updatedEmployee = {
      reportTo: employee.reportTo,
      scheduleTemplateId: employee.scheduleTemplateId,
      scheduleList: employee.scheduleList,
      category: employee.category,
    };
    logger.info(`Employee Id: ${employeeId}`);
    logger.info(`Updated employee: ${JSON.stringify(updatedEmployee)}`);
    await setDoc(doc(db, "employees", employeeId), updatedEmployee);
    return getEmployee(employeeId);
  } catch (e) {
    logger.error(`Error updating employee: ${e}`);
    throw e;
  }
};

// Delete an employee
// @param employeeId: string
// @return boolean
const deleteEmployee = async (employeeId) => {
  try {
    const employee = getEmployee(employeeId);
    // TODO: delete all schedules and the schedule template associated with this employee
    await deleteDoc(doc(db, "employees", employeeId));
    return true;
  } catch (e) {
    logger.error(`Error deleting employee: ${e}`);
    throw e;
  }
};

removeCategoryForAllEmployeesUnderManager = async (managerId) => {
  const docRef = collection(db, "employees");
  const q = query(docRef, where("reportTo", "==", managerId));
  const querySnapShot = await getDocs(q);
  querySnapShot.forEach(async (doc) => {
    const id = doc.id;
    const data = doc.data();
    const employee = new Employee({ id, ...data });
    employee.setCategory(-1);
    await setDoc(doc(db, "employees", id), employee);
  });
};

module.exports = {
  Employee,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
