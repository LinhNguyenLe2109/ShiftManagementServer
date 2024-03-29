const logger = require("../../../logger");
const { createShiftInstance } = require("../../../database/shiftInstance");
const { findScheduleParent } = require("../../../utils/findScheduleParent");

const createShift = async (req, res) => {
  try {
    logger.info("createShift called");
    logger.debug(req.body);
    if (req.body.parentSchedule == null)
      await findScheduleParent(req.body);
    const shiftInstance = await createShiftInstance(req.body);
    return res.status(200).json(shiftInstance);
  } catch (e) {
    logger.error(`Error in createShift: ${e}`);
    return res.status(500).json({ error: "Error in createShift" });
  }
};

module.exports = createShift;
