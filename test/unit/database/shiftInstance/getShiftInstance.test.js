const {
  ShiftInstance,
  createShiftInstance,
  getShiftInstance,
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
    await createShiftInstance(shiftInstance);
  });
  afterEach(async () => {
    await deleteShiftInstance(shiftId);
  });

  test("return null if shift id is invalid", async () => {
    shiftInstance.id = "abc";
    const result = await getShiftInstance(shiftInstance.id);
    expect(result).toBeNull();
  });

  test("throw error if shift id is not a string", async () => {
    shiftInstance.id = 123;
    try {
      await getShiftInstance(shiftInstance.id);
    } catch (e) {
      expect(e).toEqual(new Error("Error getting shiftInstance"));
    }
  });

  test("return shift instance if shift id is valid", async () => {
    const result = await getShiftInstance(shiftInstance.id);
    expect(result).toEqual(shiftInstance);
  });
});
