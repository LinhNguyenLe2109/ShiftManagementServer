const { beforeEach } = require("node:test");
const {
  ShiftSchedule,
  createShiftSchedule,
  deleteShiftSchedule,
  getShiftSchedule,
} = require("../../../../src/database/shiftSchedule");
const { v4: uuidv4 } = require("uuid");

describe("getShiftSchedule", () => {
  const shiftScheduleId = uuidv4();
  let shiftSchedule = null;
  beforeEach(async () => {
    shiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: false,
      employeeId: uuidv4(),
      startDate: new Date("2022-12-12T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });
    await createShiftSchedule(shiftSchedule);
  });
  afterEach(async () => {
    await deleteShiftSchedule(shiftScheduleId);
  });

  test("get shift schedule by id", async () => {
    const result = await getShiftSchedule(shiftScheduleId);
    expect(result).toEqual(shiftSchedule);
  });

  test("throw error if shift schedule id is invalid", async () => {
    try {
      await getShiftSchedule("invalid-id");
    } catch (e) {
      expect(e).toEqual(new Error("Invalid shift schedule id"));
    }
  });
});
