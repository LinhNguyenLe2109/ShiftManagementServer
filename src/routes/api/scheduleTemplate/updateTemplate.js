const logger = require("../../../logger");
const { updateShiftScheduleTemplate } = require("../../../database/shiftScheduleTemplate");

const updateTemplate = async (req, res) => {
  try {
    logger.info("updateTemplate called");
    const result = await updateShiftScheduleTemplate(req.body.id, req.body.updateData);
    return res.status(200).json({ success: true, updatedSchedule: result });
  } catch (e) {
    logger.error(`Error in updateTemplate: ${e}`);
    return res.status(500).json({ success: false });
  }
};
module.exports = updateTemplate;
