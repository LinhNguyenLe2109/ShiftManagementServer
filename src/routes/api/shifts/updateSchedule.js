const logger = require("../../../logger");
const { createShiftInstance, deleteShiftInstance, softUpdateShiftInstance } = require("../../../database/shiftInstance");

const updateSchedule = async (req, res) => {
  try {
    logger.info("updateSchedule called");
    logger.debug(req.body);
    //TODO: permissions
    for (const newShift of req.body.addedShifts) {
      await createShiftInstance({
        id: null,
        name: newShift.name,
        desc: newShift.desc,
        createdBy: res.locals.userDecodedToken.user_id,
        parentSchedule: "todo", //?? no time to figure out
        startTime: new Date(newShift.startTime),
        endTime: new Date(newShift.endTime),
        employeeId: req.body.scheduleUser,
        completed: newShift.completed,
        report: null,
      });
    }
    for (const deletedShiftId of req.body.deletedShifts) {
      await deleteShiftInstance(deletedShiftId);
    }
    for (const editedShift of req.body.editedShifts) {
      editedShift.startTime = new Date(editedShift.startTime);
      editedShift.endTime = new Date(editedShift.endTime);
      await softUpdateShiftInstance(editedShift);
    }
    return res.status(200);
  } catch (e) {
    logger.error(`Error in updateSchedule: ${e}`);
    return res.status(500).send("Error in updateSchedule");
  }
};

module.exports = updateSchedule;
