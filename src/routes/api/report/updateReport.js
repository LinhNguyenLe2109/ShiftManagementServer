const logger = require("../../../logger");
const { updateReport } = require("../../../database/report");
const verifyString = require("../../../utils/verifyString");
const createErrorResponse = require("../../../utils/createErrorResponse");
const createSuccessResponse = require("../../../utils/createSuccessResponse");

const updateReportData = async (req, res) => {
  try {
    logger.info("updateReport: updateReport");
    // Extract info from request
    // Check if reportId is there
    if (verifyString(req.body.reportId) === false) {
      res.status(400).send(createErrorResponse(400, "Report Id is required"));
      return;
    }
    const reportId = req.body.reportId;
    const reportData = req.body.updatedData;
    const result = await updateReport(reportId, reportData);
    if (!result.success) {
      res.status(404).json(createErrorResponse(404, "Report not found"));
      return;
    }
    res
      .status(200)
      .json(createSuccessResponse({ message: "Report updated", ...result }));
  } catch (err) {
    logger.error(err);
  }
};

module.exports = updateReportData;
