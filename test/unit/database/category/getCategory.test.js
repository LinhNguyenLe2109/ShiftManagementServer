const {
  Category,
  createCategory,
  deleteAllCategoriesForManager,
  getCategory,
} = require("../../../../src/database/category");

const { v4: uuidv4 } = require("uuid");

const testUuid = uuidv4();

describe("getCategory", () => {
  afterEach(async () => {
    await deleteAllCategoriesForManager(testUuid);
  });
  test("get category return a Category class", async () => {
    const category1 = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      name: "test",
      description: "test",
    });
    await createCategory(category1);
    const result = await getCategory(category1.id);
    expect(result).toEqual(category1);
  });

  test("incorrect id return error", async () => {
    try {
      await getCategory("123");
    } catch (e) {
      expect(e).toEqual(new Error("No such document!"));
    }
  });
});
