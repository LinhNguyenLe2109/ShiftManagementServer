const logger = require("../../../logger");
const { getReport } = require("../../../database/report");
const verifyString = require("../../../utils/verifyString");
const createErrorResponse = require("../../../utils/createErrorResponse");
const createSuccessResponse = require("../../../utils/createSuccessResponse");

const fetchReport = async (req, res) => {
  try {
    logger.info("getReport: fetchReport");
    // Extract info from request
    // Check if reportId is there
    if (verifyString(req.params.reportId) === false) {
      res.status(400).send(createErrorResponse(400, "Report Id is required"));
      return;
    }
    const reportId = req.params.reportId;
    const report = await getReport(reportId);
    if (!report) {
      res.status(404).json(createErrorResponse(404, "Report not found"));
      return;
    }
    // logger.info(report);
    res.status(200).json(createSuccessResponse({ ...report }));
  } catch (err) {
    logger.error(err);
  }
};

module.exports = fetchReport;
