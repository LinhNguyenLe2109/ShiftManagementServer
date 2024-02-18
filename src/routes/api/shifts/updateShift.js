const logger = require("../../../logger");
const { updateShiftInstance } = require("../../../database/shiftInstance");

const updateShift = async (req, res) => {
  try {
    logger.info("updateShift called");
    logger.debug(req.body);
    const updatedShift = await updateShiftInstance(
      req.body.id,
      req.body.updateData
    );
    return res.status(200).json(updatedShift);
  } catch (e) {
    logger.error(`Error in updateShift: ${e}`);
    return res.status(500).json({ error: "Error in updateShift" });
  }
};

module.exports = updateShift;
