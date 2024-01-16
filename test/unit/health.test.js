const request = require("supertest");
const app = require("../../src/app");
describe("Health check", () => {
  test("Health", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});