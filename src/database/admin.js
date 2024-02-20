const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc } = require("firebase/firestore");
const logger = require("../logger");
const { getUserInfo } = require("../database/users");

class Admin {
  constructor({ id, managerList }) {
    this.id = id;
    this.managerList = managerList ? managerList : [];
  }

  getManagerList = async () => {
    let managers = [];
    for (let i = 0; i < this.managerList.length; i++) {
      const manager = await getUserInfo(this.managerList[i]);
      managers.push(manager);
    }
    return managers;
  };

  addManager = async (managerId) => {
    this.managerList.push(managerId);
  };

  addMultipleManagers = async (managerIds) => {
    this.managerList = this.managerList.concat(managerIds);
  };

  removeManager = async (managerId) => {
    const index = this.managerList.indexOf(managerId);
    if (index > -1) {
      this.managerList.splice(index, 1);
    }
  };
  removeMultipleManagers = async (managerIds) => {
    for (let i = 0; i < managerIds.length; i++) {
      const index = this.managerList.indexOf(managerIds[i]);
      if (index > -1) {
        this.managerList.splice(index, 1);
      }
    }
  };

  getDetailedAdminInfo = async () => {
    const id = this.id;
    const managers = await this.getManagerList();
    return { id, managers };
  };
}

const createAdmin = async (adminId) => {
  try {
    await setDoc(doc(db, "admin", adminId), {
      id: adminId,
      managerList: [],
    });
    const admin = new Admin({ id: adminId });
    return admin;
  } catch (e) {
    logger.error("Error creating admin: " + e);
    throw e;
  }
};

const getAdmin = async (adminId) => {
  try {
    const docRef = doc(db, "admin", adminId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const id = docSnap.id;
      const data = docSnap.data();
      const admin = new Admin({ id, ...data });
      return admin.getDetailedAdminInfo();
    } else {
      return null;
    }
  } catch (e) {
    logger.error(`Error getting admin: ${e}`);
    throw e;
  }
};

// Update an admin
// To add a manager, use addManager key
// To add multiple managers, use addMultipleManagers key
// To remove a manager, use removeManager key
// To remove multiple managers, use removeMultipleManagers key
// @param adminId: string
// @param updatedAdmin: object
const updateAdmin = async (adminId, updatedAdmin) => {
  const admin = await getAdmin(adminId);
  if (updatedAdmin.hasOwnProperty("addManager")) {
    admin.addManager(updatedAdmin.addManager);
  }
  if (updatedAdmin.hasOwnProperty("addMultipleManagers")) {
    admin.addMultipleManagers(updatedAdmin.addMultipleManagers);
  }
  if (updatedAdmin.hasOwnProperty("removeManager")) {
    admin.removeManager(updatedAdmin.removeManager);
  }
  if (updatedAdmin.hasOwnProperty("removeMultipleManagers")) {
    admin.removeMultipleManagers(updatedAdmin.removeMultipleManagers);
  }
  return admin;
};

const deleteAdmin = async (adminId) => {
  try {
    const admin = await getAdmin(adminId);
    if (admin == null) {
      return false;
    }
    if (admin.managerList.length > 0) {
      return false;
    }
    const docRef = doc(db, "admin", adminId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    logger.error("Error deleting admin from auth db: " + e);
    throw e;
  }
};

module.exports = { Admin, createAdmin, getAdmin, updateAdmin, deleteAdmin };
