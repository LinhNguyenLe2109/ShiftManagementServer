const logger = require("../logger");
const { createShiftSchedule, getShiftSchedulesByDate } = require("../database/shiftSchedule");
//If we end up here (from createShift or updateShift), it means that a shift was uploaded without a parentSchedule.
//The frontend should do this if there were no possible schedules.

//This function should set parentSchedule to a valid schedule, making a new one if necessary.
const findScheduleParent = async (shift) => {
    //Try to find existing schedule
    //employeeId, startTime, endTime should match, however endTime is going to be ignored :(
    const shiftWeekStart = getSundayOfWeek(shift.startTime);
    var schedule = await getShiftSchedulesByDate(shift.employeeId, shiftWeekStart);
    if (!schedule) {
        logger.info("findScheduleParent was unable to find a valid schedule");
        schedule = await createShiftSchedule({
            id: null, 
            archived: false, 
            shiftIdList: [shift.id],
            desc: "", 
            startTime: shiftWeekStart, 
            employeeId: shift.employeeId
        });
    }
    shift.parentSchedule = schedule.id;
    return shift;
};

function getSundayOfWeek(d) {
    const today = new Date(d);
    const day = today.getDay(); // Get the day of the week (0-6, 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    if (day === 0) {
        // If today is Sunday
        return today; // Return today's date
    } else {
        const diff = today.getDate() - day; // Calculate the difference between today and the previous Sunday
        var noTime = new Date(today.setDate(diff));
        noTime = new Date(noTime.getFullYear(), noTime.getMonth(), noTime.getDate());
        return noTime; // Set the date to the previous Sunday and return it
        //+ with no time component!
    }
}
module.exports = { findScheduleParent };
  