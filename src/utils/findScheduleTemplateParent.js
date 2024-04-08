const logger = require("../logger");
const { createShiftScheduleTemplate, getShiftScheduleTemplateFor } = require("../database/shiftScheduleTemplate");
//If we end up here (from createShift), it means that a shift template was uploaded without a parentSchedule.
//The frontend should do this if there was no template for the employee.

//This function should set parentSchedule to a valid schedule, making a new one if necessary.
const findScheduleTemplateParent = async (shift) => {
    var schedule = await getShiftScheduleTemplateFor(shift.employeeId);
    if (!schedule) {
        logger.info("findScheduleTemplateParent was unable to find a valid schedule");
        schedule = await createShiftScheduleTemplate({
            id: null, 
            archived: false, 
            shiftIdList: [shift.id],
            desc: "", 
            employeeId: shift.employeeId
        });
    }
    shift.parentSchedule = schedule.id;
    return shift;
};
module.exports = { findScheduleTemplateParent };
  