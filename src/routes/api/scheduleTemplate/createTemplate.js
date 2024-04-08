const logger = require("../../../logger");
const { createShiftScheduleTemplate } = require("../../../database/shiftScheduleTemplate");

const createScheduleTemplate = async (req, res) => {
  try {
    logger.info("createScheduleTemplate called");
    const schedule = await createShiftScheduleTemplate(req.body);
    return res.status(200).json({ success: true, schedule });
  } catch (e) {
    logger.error(`Error in createScheduleTemplate: ${e}`);
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = createScheduleTemplate;
