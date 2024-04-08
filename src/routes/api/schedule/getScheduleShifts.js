const {
  getScheduleShifts,
} = require("../../../database/shiftSchedule");
const logger = require("../../../logger");

const getScheduleShiftsRoute = async (req, res) => {
  try {
    logger.info("getScheduleShifts called");
    const shiftInstances = await getScheduleShifts(
      req.params.scheduleId
    );
    logger.debug(shiftInstances);
    return res.status(200).json(shiftInstances);
  } catch (e) {
    logger.error(`Error in getScheduleShifts: ${e}`);
    return res.status(500).json({ error: "Error in getScheduleShifts" });
  }
};

module.exports = getScheduleShiftsRoute;
