const {
  Category,
  createCategory,
  deleteAllCategoriesForManager,
} = require("../../../../src/database/category");

const { v4: uuidv4 } = require("uuid");

const testUuid = uuidv4();

describe("deleteAllCategoriesForManager", () => {
  test("delete all categories for a manager return true", async () => {
    const category1 = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      name: "test",
      description: "test",
    });
    const category2 = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      name: "test",
      description: "test",
    });
    await createCategory(category1);
    await createCategory(category2);
    const result = await deleteAllCategoriesForManager(testUuid);
    expect(result).toBe(true);
  });

  test("wrong manger id return false", async () => {
    const result = await deleteAllCategoriesForManager("123");
    expect(result).toBe(false);
  });
});
