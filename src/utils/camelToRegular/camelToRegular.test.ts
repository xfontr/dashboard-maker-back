import camelToRegular from "./camelToRegular";

describe("Given a camelToRegular function", () => {
  describe("When called with the word 'camelCase'", () => {
    test("Then it should return 'Camel Case'", () => {
      const camelCaseWord = "camelCase";
      const normalWord = "Camel Case";

      const result = camelToRegular(camelCaseWord);

      expect(result).toBe(normalWord);
    });
  });
});
