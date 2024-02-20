const logger = require("../../../logger");
const { createShiftInstance, deleteShiftInstance, softUpdateShiftInstance, ShiftInstance } = require("../../../database/shiftInstance");
const { Manager, updateManager } = require("../../../database/manager");

const updateSchedule = async (req, res) => {
  try {
    //TODO: permissions
    logger.info("updateSchedule called");
    logger.debug(req.body);
    if (req.body.scheduleUser) {
      //Assigned shifts
      for (const newShift of req.body.addedShifts) {
        await createShiftInstance(new ShiftInstance({
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
        }));
      }
    } else {
      //Unassigned shifts
      logger.info("No scheduleUser provided! Assuming unassigned...")
      for (const newShift of req.body.addedShifts) {
        const x = await createShiftInstance(new ShiftInstance({
          id: null,
          name: newShift.name,
          desc: newShift.desc,
          createdBy: res.locals.userDecodedToken.user_id,
          parentSchedule: null,
          startTime: new Date(newShift.startTime),
          endTime: new Date(newShift.endTime),
          employeeId: req.body.scheduleUser,
          completed: newShift.completed,
          report: null,
        }));
        updateManager(res.locals.userDecodedToken.user_id, {addUnassignedShift: x.id})
      }
    }
    for (const deletedShiftId of req.body.deletedShifts) {
      await deleteShiftInstance(deletedShiftId, Manager, updateManager);
    }
    for (const editedShift of req.body.editedShifts) {
      editedShift.startTime = new Date(editedShift.startTime);
      editedShift.endTime = new Date(editedShift.endTime);
      await softUpdateShiftInstance(new ShiftInstance(editedShift));
    }
    return res.status(200).send("Success!");
  } catch (e) {
    logger.error(`Error in updateSchedule: ${e}`);
    return res.status(500).send("Error in updateSchedule");
  }
};

module.exports = updateSchedule;
