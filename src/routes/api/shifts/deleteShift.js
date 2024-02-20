const logger = require("../../../logger");
const { deleteShiftInstance } = require("../../../database/shiftInstance");

const deleteShift = async (req, res) => {
  try {
    logger.info("deleteShift called");
    // logger.debug(req.body);
    const result = await deleteShiftInstance(req.params.shiftId);
    if (!result) {
      return res.status(404).json({ success: false });
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    logger.error(`Error in deleteShift: ${e}`);
    return res.status(500).send("Error in deleteShift");
  }
};

module.exports = deleteShift;
