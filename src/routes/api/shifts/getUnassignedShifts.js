const { Manager, getManager } = require("../../../database/manager");
const logger = require("../../../logger");

const getUnassignedShifts = async (req, res) => { //req.body
  try {
    logger.info("getUnassignedShifts called");
    if (!req.body.endTime || !req.body.startTime) {
        return res.status(400).send("Missing startTime and endTime parameters");
    }
    const m = await getManager(res.locals.userDecodedToken.uid);
    //this isn't date filtered! getManager returns all the shifts anyway...
    const shiftInstances = m.unassignedShifts;
    return res.status(200).json(shiftInstances);
  } catch (e) {
    logger.error(`Error in getUnassignedShifts: ${e}`);
    return res.status(500).send("Error in getUnassignedShifts");
  }
};

module.exports = getUnassignedShifts;
