const logger = require("../../../logger");
const { createShiftSchedule } = require("../../../database/shiftSchedule");

const createSchedule = async (req, res) => {
  try {
    logger.info("createSchedule called");
    const schedule = await createShiftSchedule(req.body);
    return res.status(200).json({ success: true, schedule });
  } catch (e) {
    logger.error(`Error in createSchedule: ${e}`);
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = createSchedule;
