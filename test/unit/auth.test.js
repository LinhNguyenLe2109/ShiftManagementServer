const request = require("supertest");
const app = require("../../src/app");
describe("Auth", () => {
  // Using a valid username/password pair should give a success result with a .fragments array
  test("Recieve token from /login", async () => {
    const res = await request(app).get("/login").auth("pstaleyoff@gmail.com", "smsServRoot1");
    expect(res.statusCode).toBe(200);
  });
});