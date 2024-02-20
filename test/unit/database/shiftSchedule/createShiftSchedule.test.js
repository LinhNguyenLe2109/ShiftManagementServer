const {
  ShiftSchedule,
  createShiftSchedule,
  deleteShiftSchedule,
} = require("../../../../src/database/shiftSchedule");
const { v4: uuidv4 } = require("uuid");
describe("createShiftSchedule", () => {
  const shiftScheduleId = uuidv4();
  let shiftSchedule = null;
  beforeEach(async () => {
    shiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: false,
      employeeId: uuidv4(),
      startTime: new Date("2022-12-12T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });
  });
  afterEach(async () => {
    await deleteShiftSchedule(shiftScheduleId);
  });
  test("throw error if startTime is invalid", async () => {
    shiftSchedule.startTime = "abc";
    try {
      await createShiftSchedule(shiftSchedule);
    } catch (e) {
      expect(e).toEqual(new Error("Invalid date format for startTime"));
    }
  });
  test("throw error if startTime is empty", async () => {
    delete shiftSchedule.startTime;
    try {
      await createShiftSchedule(shiftSchedule);
    } catch (e) {
      expect(e).toEqual(new Error("Start time is required"));
    }
  });
  test("throw error if employeeId is invalid/not available", async () => {
    shiftSchedule.employeeId = undefined;
    try {
      await createShiftSchedule(shiftSchedule);
    } catch (e) {
      expect(e).toEqual(new Error("Employee ID is required"));
    }
  });
  test("return shift schedule if create successfully", async () => {
    const result = await createShiftSchedule(shiftSchedule);
    const data = await shiftSchedule.getDataForDb();
    data.startTime = data.startTime.toDate();
    data.endTime = data.endTime.toDate();
    expect(result).toEqual({ id: shiftScheduleId, ...data });
  });
});
