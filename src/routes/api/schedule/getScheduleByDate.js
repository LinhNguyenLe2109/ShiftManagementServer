const logger = require("../../../logger");

const { getShiftSchedulesByDate } = require("../../../database/shiftSchedule");

const getScheduleByDate = async (req, res) => {
  try {
    logger.info("getScheduleByDate called");
    const scheduleInstances = await getShiftSchedulesByDate(
      req.body.employeeId,
      req.body.date
    );
    return res.status(200).json(scheduleInstances);
  } catch (e) {
    logger.error(`Error in getScheduleByDate: ${e}`);
    return res.status(500).json({ error: "Error in getScheduleByDate" });
  }
};
module.exports = getScheduleByDate;
