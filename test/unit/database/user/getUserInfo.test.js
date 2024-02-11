const {
  User,
  deleteUser,
  createUser,
  getUserInfo,
} = require("../../../../src/database/users");

const { signup } = require("../../../../src/database/authentication");
const { v4: uuidv4 } = require("uuid");

describe("getUserInfo", () => {
  let userId = "";
  let user = null;
  beforeAll(async () => {
    const data = await signup("test@gmail.com", "password");
    user = new User({
      id: data.uid,
      email: data.email,
      lastName: "John",
      firstName: "Doe",
      createdOn: new Date(),
      active: 1,
      accessLevel: 1,
      accountInfo: uuidv4(),
      notificationList: [],
    });
    userId = user.id;
    await createUser(user);
  });
  afterAll(async () => {
    await deleteUser(userId);
  });

  test("successful fetch user info return user object", async () => {
    const result = await getUserInfo(userId);
    expect(result).toEqual(user);
  });

  test("wrong user id return null", async () => {
    const result = await getUserInfo("123");
    expect(result).toBe(null);
  });
});
