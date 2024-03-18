const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc } = require("firebase/firestore");
const logger = require("../logger");
const {
  getShiftInstance,
  deleteShiftInstance,
} = require("../database/shiftInstance");
const {
  getCategory,
  deleteAllCategoriesForManager,
} = require("../database/category");
const {
  removeCategoryForAllEmployeesUnderManager,
  getEmployee,
} = require("../database/employee");
const { getUserInfo, createUser } = require("../database/users");

class Manager {
  constructor({ id, employeeList, categoryList, unassignedShifts }) {
    this.id = id;
    this.employeeList = employeeList ? employeeList : [];
    this.categoryList = categoryList ? categoryList : [];
    this.unassignedShifts = unassignedShifts ? unassignedShifts : [];
  }
  getDataForDB() {
    return {
      id: this.id,
      employeeList: this.employeeList,
      categoryList: this.categoryList,
      unassignedShifts: this.unassignedShifts,
    };
  }
  getEmployeeList = async () => {
    logger.debug("Inside getEmployeeList");
    let employees = [];
    for (let i = 0; i < this.employeeList.length; i++) {
      const employee = await getUserInfo(this.employeeList[i]);
      employees.push(employee);
    }
    return employees;
  };

  addEmployee = async (employeeId) => {
    this.employeeList.push(employeeId);
  };

  addMultipleEmployees = async (employeeIds) => {
    this.employeeList = this.employeeList.concat(employeeIds);
  };

  removeEmployee = async (employeeId) => {
    const index = this.employeeList.indexOf(employeeId);
    if (index > -1) {
      this.employeeList.splice(index, 1);
    }
  };

  removeMultipleEmployees = async (employeeIds) => {
    for (let i = 0; i < employeeIds.length; i++) {
      const index = this.employeeList.indexOf(employeeIds[i]);
      if (index > -1) {
        this.employeeList.splice(index, 1);
      }
    }
  };

  getCategoryList = async () => {
    logger.debug("Inside getCategoryList");
    let categories = [];
    for (let i = 0; i < this.categoryList.length; i++) {
      const category = await getCategory(this.categoryList[i]);
      categories.push(category);
    }
    return categories;
  };

  addCategory = async (categoryId) => {
    this.categoryList.push(categoryId);
  };

  addMultipleCategories = async (categoryIds) => {
    this.categoryList = this.categoryList.concat(categoryIds);
  };

  removeCategory = async (categoryId) => {
    const index = this.categoryList.indexOf(categoryId);
    if (index > -1) {
      this.categoryList.splice(index, 1);
    }
  };

  removeMultipleCategories = async (categoryIds) => {
    for (let i = 0; i < categoryIds.length; i++) {
      const index = this.categoryList.indexOf(categoryIds[i]);
      if (index > -1) {
        this.categoryList.splice(index, 1);
      }
    }
  };

  getUnassignedShifts = async () => {
    let shifts = [];
    for (let i = 0; i < this.unassignedShifts.length; i++) {
      const shift = await getShiftInstance(this.unassignedShifts[i]);
      shifts.push(shift);
    }
    return shifts;
  };

  // @param shiftId: string
  // @param categoryId: array
  addUnassignedShift = async ({ shiftId, categoryList }) => {
    this.unassignedShifts.push({ shiftId, categoryList });
  };

  addMultipleUnassignedShifts = async (unassignedShiftList) => {
    for (let i = 0; i < unassignedShiftList.length; i++) {
      if (
        unassignedShiftList[i].hasOwnProperty("shiftId") &&
        unassignedShiftList[i].shiftId === undefined
      ) {
        throw new Error("Shift ID is required");
      }
      if (
        unassignedShiftList[i].hasOwnProperty("categoryList") &&
        unassignedShiftList[i].categoryList === undefined
      ) {
        throw new Error("Category List is required");
      }
    }
    this.unassignedShifts = this.unassignedShifts.concat(unassignedShiftList);
  };

  removeUnassignedShift = async (shiftId) => {
    const index = this.unassignedShifts.map((e) => e.id).indexOf(shiftId);
    if (index > -1) {
      this.unassignedShifts.splice(index, 1);
    }
  };

  removeMultipleUnassignedShifts = async (shiftIds) => {
    for (let i = 0; i < shiftIds.length; i++) {
      for (let j = 0; j < this.unassignedShifts.length; j++) {
        if (this.unassignedShifts[j].shiftId === shiftIds[i]) {
          this.unassignedShifts.splice(j, 1);
          break;
        }
      }
    }
  };

  getDetailedManagerInfo = async () => {
    const id = this.id;
    const categories = await this.getCategoryList();
    const employees = await this.getEmployeeList();

    const unassignedShifts = await this.getUnassignedShifts();
    return {
      id,
      employees,
      categories,
      unassignedShifts,
    };
  };
}

const createManager = async (managerId) => {
  try {
    if (await getManager(managerId)) {
      return false;
    }
    const docRef = doc(db, "managers", managerId);
    await setDoc(docRef, {
      employeeList: [],
      categoryList: [],
      unassignedShifts: [],
    });
    return true;
  } catch (e) {
    logger.error(`Error creating manager: ${e}`);
    throw e;
  }
};

const getManager = async (managerId) => {
  try {
    const docRef = doc(db, "managers", managerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const id = docSnap.id;
      const data = docSnap.data();
      const manager = new Manager({ id, ...data });
      return manager;
      // somehow return this causes the functions to not work, need further investigation
      // return manager.getDetailedManagerInfo();
    } else {
      return null;
    }
  } catch (e) {
    logger.error(`Error getting manager: ${e}`);
    throw e;
  }
};

// Update a manager
// To add an employee, use addEmployee key
// To add multiple employees, use addMultipleEmployees key
// To remove an employee, use removeEmployee key
// To remove multiple employees, use removeMultipleEmployees key
// To add a category, use addCategory key
// To add multiple categories, use addMultipleCategories key
// To remove a category, use removeCategory key
// To remove multiple categories, use removeMultipleCategories key
// To add an unassigned shift, use addUnassignedShift key
// To add multiple unassigned shifts, use addMultipleUnassignedShifts key
// To remove an unassigned shift, use removeUnassignedShift key
// To remove multiple unassigned shifts, use removeMultipleUnassignedShifts key
// @param employeeId: string
// @param updatedEmployee: object
const updateManager = async (managerId, managerUpdatedData) => {
  managerUpdatedData.id = managerId;

  const unformattedManager = await getManager(managerId);
  logger.debug("getManager return: " + JSON.stringify(unformattedManager));
  const manager = {...unformattedManager};
  logger.debug("Object manager: " + JSON.stringify(manager));

  //const manager = new Manager(await getManager(managerId));
  // Update employee list
  if (managerUpdatedData.hasOwnProperty("addEmployee")) {
    manager.employeeList.push(managerUpdatedData.addEmployee);
  }
  if (managerUpdatedData.hasOwnProperty("addMultipleEmployees")) {
    manager.addMultipleEmployees(managerUpdatedData.addMultipleEmployees);
  }
  if (managerUpdatedData.hasOwnProperty("removeEmployee")) {
    manager.removeEmployee(managerUpdatedData.removeEmployee);
  }
  if (managerUpdatedData.hasOwnProperty("removeMultipleEmployees")) {
    manager.removeMultipleEmployees(managerUpdatedData.removeMultipleEmployees);
  }

  // Update category list
  if (managerUpdatedData.hasOwnProperty("addCategory")) {
    manager.categoryList.push(managerUpdatedData.addCategory);
  }
  if (managerUpdatedData.hasOwnProperty("addMultipleCategories")) {
    manager.addMultipleCategories(managerUpdatedData.addMultipleCategories);
  }
  if (managerUpdatedData.hasOwnProperty("removeCategory")) {
    manager.removeCategory(managerUpdatedData.removeCategory);
  }
  if (managerUpdatedData.hasOwnProperty("removeMultipleCategories")) {
    manager.removeMultipleCategories(
      managerUpdatedData.removeMultipleCategories
    );
  }

  // Update unassigned shifts
  if (managerUpdatedData.hasOwnProperty("addUnassignedShift")) {
    manager.addUnassignedShift(managerUpdatedData.addUnassignedShift);
  }
  if (managerUpdatedData.hasOwnProperty("addMultipleUnassignedShifts")) {
    manager.addMultipleUnassignedShifts(
      managerUpdatedData.addMultipleUnassignedShifts
    );
  }
  if (managerUpdatedData.hasOwnProperty("removeUnassignedShift")) {
    manager.removeUnassignedShift(managerUpdatedData.removeUnassignedShift);
  }
  if (managerUpdatedData.hasOwnProperty("removeMultipleUnassignedShifts")) {
    manager.removeMultipleUnassignedShifts(
      managerUpdatedData.removeMultipleUnassignedShifts
    );
  }
  try {
    // Creates the same response as getDataForDB() but with updated values
    const updatedManager = {
      id: manager.id,
      employeeList: manager.employeeList ? manager.employeeList : [],
      categoryList: manager.categoryList ? manager.categoryList : [],
      unassignedShifts: manager.unassignedShifts
        ? manager.unassignedShifts
        : [],
    };
    //
    logger.debug("Updated: " + JSON.stringify(updatedManager));
    const docRef = doc(db, "managers", managerId);
    await setDoc(docRef, updatedManager);
    logger.info(`Updated manager:` + JSON.stringify(manager));
    return manager;
  } catch (e) {
    logger.error(`Error updating manager: ${e}`);
    throw e;
  }
};

// delete a manager
// @param managerId: string
// @return boolean: true if successful, false if not or there is an existing employees in the manager or there is no manager with the given ID
const deleteManager = async (managerId) => {
  try {
    logger.info(`Deleting manager with ID: ${managerId}`);
    const manager = await getManager(managerId);
    if (manager === null) {
      return false;
    }
    // return false if manager has employees
    if (manager.employees.length > 0) {
      return false;
    }

    // Reset Category for all employees
    removeCategoryForAllEmployeesUnderManager(managerId);
    // Delete all category for a manager
    await deleteAllCategoriesForManager(managerId);
    // delete all unassigned shifts
    for (let i = 0; i < manager.unassignedShifts.length; i++) {
      await deleteShiftInstance(manager.unassignedShifts[i].shiftId);
    }
    const docRef = doc(db, "managers", managerId);
    await deleteDoc(docRef);
    logger.info(`Manager deleted with ID: ${managerId}`);
    return true;
  } catch (e) {
    logger.error(`Error deleting manager: ${e}`);
    return false;
  }
};

module.exports = {
  Manager,
  createManager,
  getManager,
  updateManager,
  deleteManager,
};
