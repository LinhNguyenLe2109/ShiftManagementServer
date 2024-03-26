const logger = require("../../../logger");

const { getShiftScheduleTemplateFor } = require("../../../database/shiftScheduleTemplate");

const getTemplateFor = async (req, res) => {
  try {
    logger.info("getTemplateFor called");
    const scheduleInstances = await getShiftScheduleTemplateFor(
      req.body.employeeId
    );
    return res.status(200).json(scheduleInstances);
  } catch (e) {
    logger.error(`Error in getTemplateFor: ${e}`);
    return res.status(500).json({ error: "Error in getTemplateFor" });
  }
};
module.exports = getTemplateFor;
