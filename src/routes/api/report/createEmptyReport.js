const logger = require("../../../logger");
const { createEmptyReport } = require("../../../database/report");
const verifyString = require("../../../utils/verifyString");
const createErrorResponse = require("../../../utils/createErrorResponse");
const createSuccessResponse = require("../../../utils/createSuccessResponse");

const createReport = async (req, res) => {
  try {
    logger.info("createReport: createEmptyReport");
    // Extract info from request
    // Check if employeeId is there
    if (verifyString(req.body.employeeId) === false) {
      res.status(400).send(createErrorResponse(400, "Employee Id is required"));
      return;
    }
    const employeeId = req.body.employeeId;
    const report = await createEmptyReport(employeeId);
    res.status(200).json(createSuccessResponse({ ...report }));
  } catch (err) {
    logger.error(err);
  }
};

module.exports = createReport;
