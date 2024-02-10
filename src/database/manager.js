const { db } = require("../database/firebase.config");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const logger = require("../logger");


class Manager {
    constructor({employeeList, categoryList, unassignedShifts}){
        this.employeeList = employeeList ? employeeList : [];
        this.categoryList = categoryList ? categoryList : [];
        this.unassignedShifts = unassignedShifts ? unassignedShifts : [];
    }
}