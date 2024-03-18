const logger = require("../../../logger");
const { deleteReport } = require("../../../database/report");
const verifyString = require("../../../utils/verifyString");
const createErrorResponse = require("../../../utils/createErrorResponse");
const createSuccessResponse = require("../../../utils/createSuccessResponse");

const removeReport = async (req, res) => {
  try {
    logger.info("deleteReport: deleteReport");
    // Extract info from request
    // Check if reportId is there
    if (verifyString(req.body.reportId) === false) {
      res.status(400).send(createErrorResponse(400, "Report Id is required"));
      return;
    }
    const reportId = req.body.reportId;
    const result = await deleteReport(reportId);
    if (!result) {
      res.status(404).json(createErrorResponse(404, "Report not found"));
      return;
    }
    res.status(200).json(createSuccessResponse({ message: "Report deleted" }));
  } catch (err) {
    logger.error(err);
  }
};

module.exports = removeReport;
