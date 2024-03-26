const {
  getScheduleTemplateShifts,
} = require("../../../database/shiftScheduleTemplate");
const logger = require("../../../logger");

const getScheduleTemplateShiftsRoute = async (req, res) => {
  try {
    logger.info("getScheduleTemplateShifts called");
    const shiftInstances = await getScheduleTemplateShifts(
      req.params.scheduleId
    );
    logger.debug(shiftInstances);
    return res.status(200).json(shiftInstances);
  } catch (e) {
    logger.error(`Error in getScheduleTemplateShifts: ${e}`);
    return res.status(500).json({ error: "Error in getScheduleTemplateShifts" });
  }
};

module.exports = getScheduleTemplateShiftsRoute;
