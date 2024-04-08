const { db } = require("../database/firebase.config");
const { doc, setDoc, getDoc, deleteDoc } = require("firebase/firestore");
const logger = require("../logger");
const { v4: uuidv4 } = require("uuid");
const verifyString = require("../utils/verifyString");
const verifyNumber = require("../utils/verifyNumber");
const { getUserInfo } = require("./users");

// Report class
// id: string
// employeeId: string
// note: string (optional)
// customerSatisfactionScore: number
// reliabilityScore: number
// efficiencyScore: number
// attentionToDetailScore: number
// adaptabilityScore: number
// problemSolvingScore: number
// upsellingScore: number
// professionalismScore: number
class Report {
  constructor({
    id,
    employeeId,
    note,
    customerSatisfactionScore,
    reliabilityScore,
    efficiencyScore,
    attentionToDetailScore,
    adaptabilityScore,
    problemSolvingScore,
    upsellingScore,
    professionalismScore,
  }) {
    this.id = verifyString(id) ? id : uuidv4();
    if (verifyString(employeeId)) {
      this.employeeId = employeeId;
    } else {
      throw new Error("Employee Id is required");
    }
    this.note = verifyString(note) ? note : "";
    // Default score values will be in middle
    this.customerSatisfactionScore = verifyNumber(customerSatisfactionScore)
      ? customerSatisfactionScore
      : 5;
    this.reliabilityScore = verifyNumber(reliabilityScore)
      ? reliabilityScore
      : 4;
    this.efficiencyScore = verifyNumber(efficiencyScore) ? efficiencyScore : 4;
    this.attentionToDetailScore = verifyNumber(attentionToDetailScore)
      ? attentionToDetailScore
      : 3;
    this.adaptabilityScore = verifyNumber(adaptabilityScore)
      ? adaptabilityScore
      : 2;
    this.problemSolvingScore = verifyNumber(problemSolvingScore)
      ? problemSolvingScore
      : 3;
    this.upsellingScore = verifyNumber(upsellingScore) ? upsellingScore : 2;
    this.professionalismScore = verifyNumber(professionalismScore)
      ? professionalismScore
      : 4;
  }

  // return a total point for all categories
  getTotal() {
    return (
      this.customerSatisfactionScore +
      this.reliabilityScore +
      this.efficiencyScore +
      this.attentionToDetailScore +
      this.adaptabilityScore +
      this.problemSolvingScore +
      this.upsellingScore +
      this.professionalismScore
    );
  }

  getId() {
    return this.id;
  }

  getDataForDb() {
    return {
      employeeId: this.employeeId,
      note: this.note,
      customerSatisfactionScore: this.customerSatisfactionScore,
      reliabilityScore: this.reliabilityScore,
      efficiencyScore: this.efficiencyScore,
      attentionToDetailScore: this.attentionToDetailScore,
      adaptabilityScore: this.adaptabilityScore,
      problemSolvingScore: this.problemSolvingScore,
      upsellingScore: this.upsellingScore,
      professionalismScore: this.professionalismScore,
    };
  }
}

const createEmptyReport = async (employeeId) => {
  logger.info("createEmptyReport: " + employeeId);
  try {
    if (!verifyString(employeeId)) {
      throw new Error("Employee Id is required");
    }
    // if (!(await getUserInfo(employeeId))) {
    //   throw new Error("Employee not found");
    // }
    const reportObj = new Report({ employeeId: employeeId });
    console.log(reportObj.getDataForDb());
    const reportId = reportObj.getId();
    await setDoc(doc(db, "reports", reportId), reportObj.getDataForDb());
    // logger.info(await getReport(reportId));
    return { success: true, report: await getReport(reportId) };
  } catch (e) {
    logger.error(e);
    return { success: false, error: e };
  }
};

const createPopulatedReport = async (reportData) => {
  try {
    if (!verifyString(reportData.employeeId)) {
      throw new Error("Employee Id is required");
    }
    if (!(await getUserInfo(reportData.employeeId))) {
      throw new Error("Employee not found");
    }
    const reportObj = new Report(reportData);
    const reportId = reportObj.getId();
    await setDoc(doc(db, "reports", reportId), reportObj.getDataForDb());
    return { success: true, report: await getReport(reportId) };
  } catch (e) {
    logger.error(e);
    return { success: false, error: e };
  }
};

const getReport = async (id) => {
  try {
    if (!verifyString(id)) {
      return null;
    }
    const docSnap = await getDoc(doc(db, "reports", id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { id, ...data };
    }
    return null;
  } catch (e) {
    logger.error(e);
    return null;
  }
};

// Update a report
// @param id: string
// @param updatedData: object
const updateReport = async (id, updatedData) => {
  try {
    if (!verifyString(id)) {
      throw new Error("Report Id is required");
    }
    const report = await getReport(id);
    if (!report) {
      throw new Error("Report not found");
    }
    const reportObj = new Report({ ...report, ...updatedData });
    console.log(reportObj.getDataForDb());
    await setDoc(doc(db, "reports", id), reportObj.getDataForDb(), {
      merge: true,
    });
    return { success: true, report: await getReport(id) };
  } catch (e) {
    logger.error(e);
    return { success: false, error: e };
  }
};

const deleteReport = async (id) => {
  try {
    if (!verifyString(id)) {
      throw new Error("Report Id is required");
    }
    await deleteDoc(doc(db, "reports", id));
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
};

module.exports = {
  Report,
  createEmptyReport,
  createPopulatedReport,
  getReport,
  updateReport,
  deleteReport,
};
