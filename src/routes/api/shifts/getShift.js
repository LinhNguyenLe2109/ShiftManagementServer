const logger = require("../../../logger");
const { getShiftInstance } = require("../../../database/shiftInstance");

const getShift = async (req, res) => {
  try {
    logger.info("getShift called");
    const shiftInstance = await getShiftInstance(req.params.shiftId);
    //logger.debug(shiftInstance);
    return res.status(200).json(shiftInstance);
  } catch (e) {
    logger.error(`Error in getShift: ${e}`);
    return res.status(500).json({ error: "Error in getShift" });
  }
};

module.exports = getShift;
