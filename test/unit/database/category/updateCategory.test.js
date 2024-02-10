const {
  Category,
  createCategory,
  deleteAllCategoriesForManager,
  getCategory,
  updateCategory,
} = require("../../../../src/database/category");

const { v4: uuidv4 } = require("uuid");

const testUuid = uuidv4();

describe("updateCategory", () => {
  afterEach(async () => {
    await deleteAllCategoriesForManager(testUuid);
  });
  test("update category return an updated version", async () => {
    let category1 = new Category({
      id: uuidv4(),
      createdBy: testUuid,
      name: "test",
      description: "test",
    });
    await createCategory(category1);

    category1.name = "new name";
    category1.description = "new description";
    await updateCategory(category1);

    const result = await getCategory(category1.id);
    expect(result).toEqual(category1);
  });
});
