const {
  Category,
  createCategory,
  getAllCategoriesForManager,
  deleteAllCategoriesForManager,
} = require("../../../../src/database/category");

const { v4: uuidv4 } = require("uuid");

const testUuid = uuidv4();

describe("getAllCategoriesForManager", () => {
  afterEach(async () => {
    await deleteAllCategoriesForManager(testUuid);
  });
  test("get all categories for a manager return an array of categories", async () => {
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
    const result = await getAllCategoriesForManager(testUuid);
    expect(result).toEqual(expect.arrayContaining([category1, category2]));
  });

  test("get all categories for a manager return null", async () => {
    const result = await getAllCategoriesForManager(testUuid);
    expect(result).toBeNull();
  });

  test("incorrect manager id return null", async () => {
    const result = await getAllCategoriesForManager("123");
    expect(result).toBeNull();
  });
});
