const {
  ShiftInstance,
  createShiftInstance,
  getShiftInstance,
  deleteShiftInstance,
  updateShiftInstance,
} = require("../../../../src/database/shiftInstance");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../../src/logger");

describe("updateShiftInstance", () => {
  const shiftId = uuidv4();
  let shiftInstance = null;
  beforeEach(async () => {
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
  });
  afterEach(async () => {
    await deleteShiftInstance(shiftId);
  });

  test("return updated shift instance when update a string property", async () => {
    const newName = "New Test Shift";
    shiftInstance.name = newName;
    const result = await updateShiftInstance(shiftId, shiftInstance);
    expect(result.name).toEqual(newName);
  });

  test("return updated shift instance when update a date property", async () => {
    const newStartTime = new Date("2022-12-12T13:00:00");
    shiftInstance.startTime = newStartTime;
    const result = await updateShiftInstance(shiftId, shiftInstance);
    expect(result.startTime).toEqual(newStartTime);
  });

  test("return updated shift instance when update a boolean property", async () => {
    shiftInstance.completed = true;
    const result = await updateShiftInstance(shiftId, shiftInstance);
    expect(result.completed).toEqual(true);
  });
});
