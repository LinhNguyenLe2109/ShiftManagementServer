const {
  ShiftInstance,
  createShiftInstance,
  deleteShiftInstance,
} = require("../../../../src/database/shiftInstance");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../../src/logger");

describe("createShiftInstance", () => {
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
  });
  afterEach(async () => {
    await deleteShiftInstance(shiftId);
  });

  test("throw error if startTime is not valid", async () => {
    shiftInstance.startTime = "abc";
    try {
      await createShiftInstance(shiftInstance);
    } catch (e) {
      expect(e).toEqual(new Error("Invalid date format for startTime"));
    }
  });

  test("throw error if startTime is empty", async () => {
    delete shiftInstance.startTime;
    try {
      await createShiftInstance(shiftInstance);
    } catch (e) {
      expect(e).toEqual(new Error("Start time is required"));
    }
  });

  test("throw error if endTime is not valid", async () => {
    shiftInstance.endTime = "abc";
    try {
      await createShiftInstance(shiftInstance);
    } catch (e) {
      expect(e).toEqual(new Error("Invalid date format for endTime"));
    }
  });

  test("throw error if endTime is empty", async () => {
    delete shiftInstance.endTime;
    try {
      await createShiftInstance(shiftInstance);
    } catch (e) {
      expect(e).toEqual(new Error("End time is required"));
    }
  });

  test("throw error if employeeId is empty", async () => {
    delete shiftInstance.employeeId;
    try {
      await createShiftInstance(shiftInstance);
    } catch (e) {
      expect(e).toEqual(new Error("Employee ID is required"));
    }
  });

  test("successfully create shift instance return an object", async () => {
    const result = new ShiftInstance(await createShiftInstance(shiftInstance));
    expect(result).toEqual(shiftInstance);
  });

  test("throw error if shift instance already exists", async () => {
    await createShiftInstance(shiftInstance);
    try {
      await createShiftInstance(shiftInstance);
    } catch (e) {
      expect(e).toEqual(new Error("ShiftInstance already exists"));
    }
  });
});
