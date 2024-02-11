const {
  Category,
  createCategory,
  deleteAllCategoriesForManager,
} = require("../../../../src/database/category");

const { v4: uuidv4 } = require("uuid");

const testUuid = uuidv4();

describe("createCategory", () => {
  afterEach(async () => {
    await deleteAllCategoriesForManager(testUuid);
  });
  test("create a new category return the new category object", async () => {
    const category = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      name: "test",
      description: "test",
    });
    const result = await createCategory(category);
    expect(result).toEqual(category);
  });

  test("create a new category with the same id return error", async () => {
    const category = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      name: "test",
      description: "test",
    });
    await createCategory(category);
    try {
      await createCategory(category);
    } catch (e) {
      expect(e).toEqual(new Error("Category already exists"));
    }
  });

  test("create a new category with missing createdBy return error", async () => {
    const category = new Category({
      id: uuidv4(),
      name: "test",
      description: "test",
    });
    try {
      await createCategory(category);
    } catch (e) {
      expect(e).toEqual(new Error("Manager ID is required"));
    }
  });

  test("create a new category with missing name return error", async () => {
    const category = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      description: "test",
    });
    try {
      await createCategory(category);
    } catch (e) {
      expect(e).toEqual(new Error("Category name is required"));
    }
  });
});
