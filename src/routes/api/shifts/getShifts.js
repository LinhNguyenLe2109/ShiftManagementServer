const {
  getShiftInstancesFromRange,
} = require("../../../database/shiftInstance");
const logger = require("../../../logger");

const getShifts = async (req, res) => {
  //req.body
  try {
    logger.info("getShiftsRange called");
    logger.debug(req.body);
    if (!req.body.endTime || !req.body.startTime || !req.body.employeeId) {
      return res
        .status(400)
        .send("Missing startTime, endTime, and employeeId parameters");
    }
    const shiftInstances = await getShiftInstancesFromRange(
      req.body.employeeId,
      req.body.startTime,
      req.body.endTime
    );
    logger.debug(shiftInstances);
    return res.status(200).json(shiftInstances);
  } catch (e) {
    logger.error(`Error in getShiftsRange: ${e}`);
    return res.status(500).json({ error: "Error in getShiftsRange" });
  }
};

module.exports = getShifts;
