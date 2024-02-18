const logger = require("../../../logger");
const { getAllShiftSchedules } = require("../../../database/shiftSchedule");

const getAllSchedules = async (req, res) => {
  try {
    logger.info("getAllSchedules called");
    const scheduleInstances = await getAllShiftSchedules(req.params.employeeId);
    //logger.debug(scheduleInstances);
    return res.status(200).json(scheduleInstances);
  } catch (e) {
    logger.error(`Error in getAllSchedules: ${e}`);
    return res.status(500).json({ error: "Error in getAllSchedules" });
  }
};
module.exports = getAllSchedules;
