const {
  User,
  deleteUser,
  createUser,
} = require("../../../../src/database/users");

const { signup, signin } = require("../../../../src/database/authentication");
const { v4: uuidv4 } = require("uuid");

describe("deleteUser", () => {
  let userId = "";
  beforeEach(async () => {
    let data = null;
    try {
      data = await signup("test@gmail.com", "password");
    } catch (e) {
      data = await signin("test@gmail.com", "password");
      await deleteUser(data.uid);
      data = await signup("test@gmail.com", "password");
    }
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
    await createUser(user);
  });

  test("delete user return true", async () => {
    const result = await deleteUser(userId);
    expect(result).toBe(true);
  });
  test("wrong user id return false", async () => {
    const result = await deleteUser("123");
    expect(result).toBe(false);
  });
});
