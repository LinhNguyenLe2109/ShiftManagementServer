const logger = require("../../../logger");
const { deleteShiftSchedule } = require("../../../database/shiftSchedule");

const deleteSchedule = async (req, res) => {
  try {
    logger.info("deleteSchedule called");
    await deleteShiftSchedule(req.params.scheduleId);
    return res.status(200).json({ success: true });
  } catch (e) {
    logger.error(`Error in deleteSchedule: ${e}`);
    return res.status(500).json({ success: false });
  }
};
module.exports = deleteSchedule;
