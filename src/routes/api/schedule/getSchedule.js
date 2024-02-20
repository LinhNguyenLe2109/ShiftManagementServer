const logger = require("../../../logger");
const { getShiftSchedule } = require("../../../database/shiftSchedule");

const getSchedule = async (req, res) => {
  try {
    logger.info("getSchedule called");
    const scheduleInstance = await getShiftSchedule(req.params.scheduleId);
    //logger.debug(scheduleInstance);
    return res.status(200).json(scheduleInstance);
  } catch (e) {
    logger.error(`Error in getSchedule: ${e}`);
    return res.status(500).json({ error: "Error in getSchedule" });
  }
};

module.exports = getSchedule;
