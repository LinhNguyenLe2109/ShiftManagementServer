const {
  getScheduleShifts,
} = require("../../../database/shiftSchedule");
const logger = require("../../../logger");

const getScheduleShifts = async (req, res) => {
  //req.body
  try {
    logger.info("getScheduleShifts called");
    logger.debug(req.body);
    if (!req.scheduleId) {
      return res
        .status(400)
        .send("Missing scheduleId");
    }
    const shiftInstances = await getScheduleShifts(
      req.body.scheduleId
    );
    logger.debug(shiftInstances);
    return res.status(200).json(shiftInstances);
  } catch (e) {
    logger.error(`Error in getScheduleShifts: ${e}`);
    return res.status(500).json({ error: "Error in getScheduleShifts" });
  }
};

module.exports = getShifts;
