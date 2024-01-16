const request = require("supertest");

const app = require("../../src/app");

describe("GET /api/test", () => {
  test("unauthenticated requests are denied", () => 
    request(app).get("/api/test").expect(401));
  test("incorrect credentials are denied", () =>
    request(app).get("/api/test").auth("invalid@email.com", "incorrect_password").expect(401));
});
