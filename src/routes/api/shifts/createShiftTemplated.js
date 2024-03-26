const logger = require("../../../logger");
const { createShiftInstance } = require("../../../database/shiftInstance");
const { findScheduleTemplateParent } = require("../../../utils/findScheduleTemplateParent");

const createShiftTemplated = async (req, res) => {
  try {
    logger.info("createShiftTemplated called");
    logger.debug(req.body);
    if (req.body.parentSchedule == null)
      await findScheduleTemplateParent(req.body);
    const shiftInstance = await createShiftInstance(req.body);
    return res.status(200).json(shiftInstance);
  } catch (e) {
    logger.error(`Error in createShiftTemplated: ${e}`);
    return res.status(500).json({ error: "Error in createShiftTemplated" });
  }
};

module.exports = createShiftTemplated;
