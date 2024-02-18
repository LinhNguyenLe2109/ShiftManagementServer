const {
  ShiftSchedule,
  createShiftSchedule,
  deleteShiftSchedule,
  getShiftSchedule,
  updateShiftSchedule,
} = require("../../../../src/database/shiftSchedule");
const { v4: uuidv4 } = require("uuid");

describe("getShiftSchedule", () => {
  const shiftScheduleId = uuidv4();
  const employeeId = uuidv4();
  const shiftId1 = uuidv4();
  const shiftId2 = uuidv4();
  const shiftId3 = uuidv4();
  const shiftId4 = uuidv4();
  let shiftSchedule = null;
  beforeEach(async () => {
    shiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: false,
      employeeId: employeeId,
      startDate: new Date("2022-12-12T12:00:00"),
      shiftIdList: [shiftId1, shiftId2],
      desc: "Test Shift Schedule Description",
    });
    await createShiftSchedule(shiftSchedule);
  });
  afterEach(async () => {
    await deleteShiftSchedule(shiftScheduleId);
  });

  test("return updated shift schedule", async () => {
    const updatedShiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: true,
      employeeId: employeeId,
      startDate: new Date("2022-12-15T11:00:00"),
      shiftIdList: [shiftId3, shiftId4],
      desc: "Test Shift Schedule Description",
    });
    const result = await updateShiftSchedule(shiftScheduleId, {
      archived: true,
      addMultipleShifts: [shiftId3, shiftId4],
      removeMultipleShifts: [shiftId1, shiftId2],
      startDate: new Date("2022-12-15T11:00:00"),
    });
    expect(result).toEqual(updatedShiftSchedule);
    expect(result).toEqual(await getShiftSchedule(shiftScheduleId));
  });
});
