const {
  ShiftSchedule,
  createShiftSchedule,
  deleteShiftSchedule,
} = require("../../../../src/database/shiftSchedule");
const { v4: uuidv4 } = require("uuid");
describe("deleteShiftSchedule", () => {
  const shiftScheduleId = uuidv4();
  beforeAll(async () => {
    const shiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: false,
      employeeId: uuidv4(),
      startTime: new Date("2022-12-12T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });
    await createShiftSchedule(shiftSchedule);
  });

  test("successfully delete shift schedule return true", async () => {
    const result = await deleteShiftSchedule(shiftScheduleId);
    expect(result).toEqual(true);
  });

  test("delete shift schedule that does not exist return false", async () => {
    const result = await deleteShiftSchedule(shiftScheduleId);
    expect(result).toEqual(false);
  });
});
