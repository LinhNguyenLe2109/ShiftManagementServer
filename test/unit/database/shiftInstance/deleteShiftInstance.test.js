const {
  ShiftInstance,
  createShiftInstance,
  deleteShiftInstance,
} = require("../../../../src/database/shiftInstance");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../../src/logger");

describe("getShiftInstance", () => {
  const shiftId = uuidv4();
  let shiftInstance = null;

  test("return true if delete successfully", async () => {
    shiftInstance = new ShiftInstance({
      id: shiftId,
      name: "Test Shift",
      desc: "Test Shift Description",
      createdBy: uuidv4(),
      parentSchedule: uuidv4(),
      startTime: new Date("2022-12-12T12:00:00"),
      endTime: new Date("2022-12-12T16:00:00"),
      employeeId: uuidv4(),
      completed: false,
      report: uuidv4(),
      location: "Test Location",
    });
    await createShiftInstance(shiftInstance);
    const result = await deleteShiftInstance(shiftId);
    expect(result).toBe(true);
  });
});
