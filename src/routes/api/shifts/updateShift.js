const logger = require("../../../logger");
const { updateShiftInstance } = require("../../../database/shiftInstance");
const { findScheduleParent } = require("../../../utils/findScheduleParent");

const updateShift = async (req, res) => {
  try {
    logger.info("updateShift called");
    logger.debug(req.body);
    if (req.body.parentSchedule == null)
      await findScheduleParent(req.body);
    const updatedShift = await updateShiftInstance(req.body);
    return res.status(200).json(updatedShift);
  } catch (e) {
    logger.error(`Error in updateShift: ${e}`);
    return res.status(500).json({ error: "Error in updateShift" });
  }
};

module.exports = updateShift;
