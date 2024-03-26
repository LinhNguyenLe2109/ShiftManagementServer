const logger = require("../../../logger");
const { getShiftScheduleTemplate } = require("../../../database/shiftScheduleTemplate");

const getSchedule = async (req, res) => {
  try {
    logger.info("getScheduleTemplate called");
    const scheduleInstance = await getShiftScheduleTemplate(req.params.scheduleId);
    return res.status(200).json(scheduleInstance);
  } catch (e) {
    logger.error(`Error in getScheduleTemplate: ${e}`);
    return res.status(500).json({ error: "Error in getScheduleTemplate" });
  }
};

module.exports = getSchedule;
