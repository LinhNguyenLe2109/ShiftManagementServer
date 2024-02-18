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
  beforeAll(async () => {
    shiftSchedule = new ShiftSchedule({
      id: shiftScheduleId,
      archived: false,
      employeeId: uuidv4(),
      startTime: new Date("2022-12-12T12:00:00"),
      shiftIdList: [uuidv4(), uuidv4()],
      desc: "Test Shift Schedule Description",
    });
    await createShiftSchedule(shiftSchedule);
  });
  afterAll(async () => {
    await deleteShiftSchedule(shiftScheduleId);
  });

  test("get shift schedule by id", async () => {
    const result = await getShiftSchedule(shiftScheduleId);
    const shiftScheduleData = await shiftSchedule.getDataForDb();
    shiftScheduleData.startTime = shiftScheduleData.startTime.toDate();
    shiftScheduleData.endTime = shiftScheduleData.endTime.toDate();
    expect(result).toEqual({ id: shiftScheduleId, ...shiftScheduleData });
  });

  test("return null if shift schedule id is invalid", async () => {
    const result = await getShiftSchedule("invalid-id");
    expect(result).toBeNull();
  });
});
