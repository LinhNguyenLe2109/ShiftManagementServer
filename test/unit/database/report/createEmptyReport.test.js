const {
  createEmptyReport,
  Report,
} = require("../../../../src/database/report");
const logger = require("../../../../src/logger");
const { v4: uuidv4 } = require("uuid");

describe("createEmptyReport", () => {
  const employeeId = uuidv4();
  const expectedResult = new Report({
    id: expect.any(String),
    employeeId: employeeId,
    note: "",
    customerSatisfactionScore: 0,
    reliabilityScore: 0,
    efficiencyScore: 0,
    attentionToDetailScore: 0,
    adaptabilityScore: 0,
    problemSolvingScore: 0,
    upsellingScore: 0,
    professionalismScore: 0,
  });
  afterEach(() => {});
  test("throw error if employee id is not a string", async () => {
    try {
      await createEmptyReport(123);
    } catch (e) {
      expect(e).toEqual(new Error("Employee Id is required"));
    }
  });
  test("return an empty report if employee id is valid", async () => {
    const result = await createEmptyReport(employeeId);
    expect(result.getDataForDb()).toEqual(expectedResult.getDataForDb());
  });
});
