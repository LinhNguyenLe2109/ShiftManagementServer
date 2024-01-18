const request = require("supertest");
const app = require("../../src/app");

describe("POST /login", () => {
  test("post valid login credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({email : "test@jest.com", password: "smsJestT4cc"});
    const body = JSON.parse(res.text);
    expect(body.user.username).toBe("test@jest.com");
    expect(body.user.token).toBeDefined();
  });
});
