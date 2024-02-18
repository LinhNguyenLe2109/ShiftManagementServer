const {
  ShiftSchedule,
  createShiftSchedule,
  deleteShiftSchedule,
  getShiftSchedulesByDate,
} = require("../../../../src/database/shiftSchedule");
const { v4: uuidv4 } = require("uuid");

describe("getShiftSchedulesByDate", () => {
  const shiftScheduleId1 = uuidv4();
  const shiftScheduleId2 = uuidv4();
  const shiftScheduleId3 = uuidv4();
  const employeeId = uuidv4();
  let shiftSchedule1 = null;
  let shiftSchedule2 = null;
  let shiftSchedule3 = null;
  beforeAll(async () => {
    shiftSchedule1 = new ShiftSchedule({
      id: shiftScheduleId1,
      archived: false,
      employeeId: employeeId,
      startDate: new Date("2022-12-12T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });
    shiftSchedule2 = new ShiftSchedule({
      id: shiftScheduleId2,
      archived: false,
      employeeId: employeeId,
      startDate: new Date("2022-12-20T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });
    shiftSchedule3 = new ShiftSchedule({
      id: shiftScheduleId3,
      archived: false,
      employeeId: employeeId,
      startDate: new Date("2022-12-28T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });

    await createShiftSchedule(shiftSchedule1);
    await createShiftSchedule(shiftSchedule2);
    await createShiftSchedule(shiftSchedule3);
  });
  afterAll(async () => {
    await deleteShiftSchedule(shiftScheduleId1);
    await deleteShiftSchedule(shiftScheduleId2);
    await deleteShiftSchedule(shiftScheduleId3);
  });

  test("get shift schedules by date", async () => {
    const result = await getShiftSchedulesByDate(
      employeeId,
      new Date("2022-12-22T12:00:00")
    );
    expect(result).toEqual(shiftSchedule2);
  });

  test("throw error if date is invalid", async () => {
    try {
      await getShiftSchedulesByDate(employeeId, "invalid-date");
    } catch (e) {
      expect(e).toEqual(new Error("Invalid date"));
    }
  });

  test("out of range date return null", async () => {
    const result = await getShiftSchedulesByDate(
      employeeId,
      new Date("2022-12-10T12:00:00")
    );
    expect(result).toEqual(null);
  });
});
