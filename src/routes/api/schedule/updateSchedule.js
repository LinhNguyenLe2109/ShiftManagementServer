const logger = require("../../../logger");
const { updateShiftSchedule } = require("../../../database/shiftSchedule");

const updateSchedule = async (req, res) => {
  try {
    logger.info("updateSchedule called");
    // logger.info(req.body.id);
    // logger.debug(req.body.updateData);
    const result = await updateShiftSchedule(req.body.id, req.body.updateData);
    return res.status(200).json({ success: true, updatedSchedule: result });
  } catch (e) {
    logger.error(`Error in updateSchedule: ${e}`);
    return res.status(500).json({ success: false });
  }
};
module.exports = updateSchedule;
