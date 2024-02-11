const {
  Category,
  createCategory,
  deleteCategory,
  getCategory,
} = require("../../../../src/database/category");

const { v4: uuidv4 } = require("uuid");

const testUuid = uuidv4();

describe("deleteCategory", () => {
  test("get category return a Category class", async () => {
    try {
      const category1 = new Category({
        id: uuidv4(),
        createdBy: testUuid,
        name: "test",
        description: "test",
      });
      await createCategory(category1);
      await deleteCategory(category1.id);
      await getCategory(category1.id);
    } catch (e) {
      expect(e).toEqual(new Error("No such document!"));
    }
  });
});
