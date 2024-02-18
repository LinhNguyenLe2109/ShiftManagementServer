const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc } = require("firebase/firestore");
const logger = require("../logger");
const { getUserInfo } = require("../database/users");
const { getShiftInstance } = require("../database/shiftInstance");
const {
  getCategory,
  deleteAllCategoriesForManager,
} = require("../database/category");
const {
  removeCategoryForAllEmployeesUnderManager,
} = require("../database/employee");

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
      unassignedShifts: this.unassignedShifts
    };
  }
  getEmployeeList = async () => {
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

  addUnassignedShift = async (shiftId) => {
    this.unassignedShifts.push(shiftId);
  };

  addMultipleUnassignedShifts = async (shiftIds) => {
    this.unassignedShifts = this.unassignedShifts.concat(shiftIds);
  };

  removeUnassignedShift = async (shiftId) => {
    const index = this.unassignedShifts.map(e => e.id).indexOf(shiftId);
    if (index > -1) {
      this.unassignedShifts.splice(index, 1);
    }
  };

  removeMultipleUnassignedShifts = async (shiftIds) => {
    for (let i = 0; i < shiftIds.length; i++) {
      const index = this.unassignedShifts.indexOf(shiftIds[i]);
      if (index > -1) {
        this.unassignedShifts.splice(index, 1);
      }
    }
  };

  getDetailedManagerInfo = async () => {
    const id = this.id;
    const employees = await this.getEmployeeList();
    const categories = await this.getCategoryList();
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
      id: managerId,
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
      return manager.getDetailedManagerInfo();
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

  const manager = new Manager(await getManager(managerId));
  // Update employee list
  if (managerUpdatedData.hasOwnProperty("addEmployee")) {
    manager.addEmployee(managerUpdatedData.addEmployee);
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
    manager.addCategory(managerUpdatedData.addCategory);
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
    const docRef = doc(db, "managers", managerId);
    await setDoc(docRef, await manager.getDataForDB());
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
    // TODO: delete all unassigned shifts
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
