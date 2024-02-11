const {
  User,
  deleteUser,
  createUser,
} = require("../../../../src/database/users");

const { signup } = require("../../../../src/database/authentication");
const { v4: uuidv4 } = require("uuid");

describe("createUser", () => {
  let userId = "";

  afterEach(async () => {
    await deleteUser(userId);
  });

  test("create user return true", async () => {
    const data = await signup("test@gmail.com", "password");
    const user = new User({
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
    const result = await createUser(user);
    expect(result).toBe(true);
  });
});
