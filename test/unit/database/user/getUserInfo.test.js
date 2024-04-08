const {
  User,
  deleteUser,
  createUser,
  getUserInfo,
} = require("../../../../src/database/users");

const { signup, signin } = require("../../../../src/database/authentication");
const { v4: uuidv4 } = require("uuid");

describe("getUserInfo", () => {
  let userId = "";
  let user = null;

  beforeAll(async () => {
    // Check if a test user with test email already exists
    try {
      // Attempt to sign up with the test email
      const data = await signup("test@gmail.com", "password");
      user = new User({
        id: data.uid,
        email: data.email,
        lastName: "John",
        firstName: "Doe",
        createdOn: new Date(),
        active: 1,
        accessLevel: -1,
        accountInfo: null,
        notificationList: [],
      });
    } catch (e) {
      // If user already exists, sign in and delete user
      const data = await signin("test@gmail.com", "password");
      await deleteUser(data.uid);
      // Sign up again to ensure a clean state for testing
      const newData = await signup("test@gmail.com", "password");
      user = new User({
        id: newData.uid,
        email: newData.email,
        lastName: "John",
        firstName: "Doe",
        createdOn: new Date(),
        active: 1,
        accessLevel: -1,
        accountInfo: null,
        notificationList: [],
      });
    }
    userId = user.id;
    // Create the test user
    await createUser(user);
  });

  afterAll(async () => {
    // Delete the test user after all tests are done
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
