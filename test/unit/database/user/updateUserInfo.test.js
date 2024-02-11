const {
  User,
  deleteUser,
  createUser,
  updateUserInfo,
  getUserInfo,
} = require("../../../../src/database/users");

const { signup } = require("../../../../src/database/authentication");
const { v4: uuidv4 } = require("uuid");

describe("updateUserInfo", () => {
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
    let updatedUser = { ...user };
    updatedUser.firstName = "Jane";
    await updateUserInfo(userId, updatedUser);
    const result = await getUserInfo(userId);
    expect(result.firstName).toEqual(updatedUser.firstName);

    updatedUser.lastName = "Smith";
    await updateUserInfo(userId, updatedUser);
    const result2 = await getUserInfo(userId);
    expect(result2.lastName).toEqual(updatedUser.lastName);

    updatedUser.accessLevel = 2;
    await updateUserInfo(userId, updatedUser);
    const result3 = await getUserInfo(userId);
    expect(result3.accessLevel).toEqual(updatedUser.accessLevel);

    updatedUser.active = 0;
    await updateUserInfo(userId, updatedUser);
    const result4 = await getUserInfo(userId);
    expect(result4.active).toEqual(updatedUser.active);
  });

  test("wrong user id return null", async () => {
    const result = await updateUserInfo("123", user);
    expect(result).toBe(null);
  });
});
