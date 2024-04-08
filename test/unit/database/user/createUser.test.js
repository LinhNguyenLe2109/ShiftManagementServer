const {
  User,
  deleteUser,
  createUser,
} = require("../../../../src/database/users");

const { signup, signin } = require("../../../../src/database/authentication");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../../src/logger");

describe("createUser", () => {
  let userId = "";

  afterEach(async () => {
    await deleteUser(userId);
  });

  test("create user return true", async () => {
    let data = null;
    try {
      data = await signup("test@gmail.com", "password");
      console.log("continue");
    } catch (e) {
      console.log("catch");
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
    const result = await createUser(user);
    expect(result.success).toBe(true);
  });

  test("create user that already exists return false", async () => {
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
    const result = await createUser(user);
    expect(result.success).toBe(false);
  });
});
