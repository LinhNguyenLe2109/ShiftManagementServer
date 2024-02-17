const {
  ShiftInstance,
  createShiftInstance,
  getShiftInstancesFromRange,
  deleteShiftInstance,
} = require("../../../../src/database/shiftInstance");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../../src/logger");

describe("createShiftInstance", () => {
  const shiftId1 = uuidv4();
  const shiftId2 = uuidv4();
  const shiftId3 = uuidv4();
  const shiftId4 = uuidv4();
  const employeeId = uuidv4();
  let shiftInstance1 = null;
  let shiftInstance2 = null;
  let shiftInstance3 = null;
  let shiftInstance4 = null;
  beforeAll(async () => {
    shiftInstance1 = new ShiftInstance({
      id: shiftId1,
      name: "Test Shift 1",
      desc: "Test Shift Description 1",
      createdBy: uuidv4(),
      parentSchedule: uuidv4(),
      startTime: new Date("2022-12-12T12:00:00"),
      endTime: new Date("2022-12-12T16:00:00"),
      employeeId: employeeId,
      completed: false,
      report: uuidv4(),
      location: "Test Location",
    });
    shiftInstance2 = new ShiftInstance({
      id: shiftId2,
      name: "Test Shift 2",
      desc: "Test Shift Description 2",
      createdBy: uuidv4(),
      parentSchedule: uuidv4(),
      startTime: new Date("2022-12-13T12:00:00"),
      endTime: new Date("2022-12-13T16:00:00"),
      employeeId: employeeId,
      completed: false,
      report: uuidv4(),
      location: "Test Location",
    });
    shiftInstance3 = new ShiftInstance({
      id: shiftId3,
      name: "Test Shift 3",
      desc: "Test Shift Description 3",
      createdBy: uuidv4(),
      parentSchedule: uuidv4(),
      startTime: new Date("2022-12-14T12:00:00"),
      endTime: new Date("2022-12-14T16:00:00"),
      employeeId: employeeId,
      completed: false,
      report: uuidv4(),
      location: "Test Location",
    });
    shiftInstance4 = new ShiftInstance({
      id: shiftId4,
      name: "Test Shift 4",
      desc: "Test Shift Description 4",
      createdBy: uuidv4(),
      parentSchedule: uuidv4(),
      startTime: new Date("2022-12-15T12:00:00"),
      endTime: new Date("2022-12-15T16:00:00"),
      employeeId: employeeId,
      completed: false,
      report: uuidv4(),
      location: "Test Location",
    });

    await createShiftInstance(shiftInstance1);
    await createShiftInstance(shiftInstance2);
    await createShiftInstance(shiftInstance3);
    await createShiftInstance(shiftInstance4);
    logger.info([
      shiftInstance1,
      shiftInstance2,
      shiftInstance3,
      shiftInstance4,
    ]);
  });

  afterAll(async () => {
    await deleteShiftInstance(shiftId1);
    await deleteShiftInstance(shiftId2);
    await deleteShiftInstance(shiftId3);
    await deleteShiftInstance(shiftId4);
  });

  test("throw error if employee id is not a string", async () => {
    try {
      await getShiftInstancesFromRange(
        123,
        new Date("2022-12-12T12:00:00"),
        new Date("2022-12-12T16:00:00")
      );
    } catch (e) {
      expect(e.message).toEqual(
        "Error getting shiftInstancesFromRange:TypeError: str.trim is not a function"
      );
    }
  });

  test("throw error if start Range is not a valid date", async () => {
    try {
      await getShiftInstancesFromRange(
        employeeId,
        "this is invalid",
        new Date("2022-12-12T16:00:00")
      );
    } catch (e) {
      expect(e.message).toEqual(
        "Error getting shiftInstancesFromRange:Error: Invalid date format for start"
      );
    }
  });

  test("throw error if end Range is not a valid date", async () => {
    try {
      expect(
        async () =>
          await getShiftInstancesFromRange(
            employeeId,
            new Date("2022-12-12T12:00:00"),
            "this is invalid"
          )
      );
    } catch (e) {
      expect(e.message).toEqual(
        "Error getting shiftInstancesFromRange:Error: Invalid date format for end"
      );
    }
  });

  test("return empty array if date is out of range", async () => {
    const result = await getShiftInstancesFromRange(
      employeeId,
      new Date("2022-12-12T18:00:00"),
      new Date("2022-12-12T20:00:00")
    );
    expect(result).toEqual([]);
  });

  test("return empty array if employee id is not found", async () => {
    const result = await getShiftInstancesFromRange(
      uuidv4(),
      new Date("2022-12-12T12:00:00"),
      new Date("2022-12-12T16:00:00")
    );
    expect(result).toEqual([]);
  });

  test("return an array of shift instances if date is in range", async () => {
    const result = await getShiftInstancesFromRange(
      employeeId,
      new Date("2022-12-12T12:00:00"),
      new Date("2022-12-14T18:00:00")
    );
    expect(result.length).toEqual(3);
    expect(result).toEqual(expect.arrayContaining([shiftInstance1, shiftInstance2, shiftInstance3]));

  });
});
