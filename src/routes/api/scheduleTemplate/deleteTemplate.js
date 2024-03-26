const logger = require("../../../logger");
const { deleteShiftScheduleTemplate } = require("../../../database/shiftScheduleTemplate");

const deleteScheduleTemplate = async (req, res) => {
  try {
    logger.info("deleteScheduleTemplate called");
    await deleteShiftScheduleTemplate(req.params.scheduleId);
    return res.status(200).json({ success: true });
  } catch (e) {
    logger.error(`Error in deleteScheduleTemplate: ${e}`);
    return res.status(500).json({ success: false });
  }
};
module.exports = deleteScheduleTemplate;
