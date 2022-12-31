import getBearerToken from "../getBearerToken";

describe("Given a getBearerToken function", () => {
  describe("When called with a text 'Bearer token'", () => {
    test("Then it should return 'token'", () => {
      const text = "Bearer token";
      const expectedResult = "token";

      const result = getBearerToken(text);

      expect(result).toBe(expectedResult);
    });
  });

  describe("When called with a text 'token'", () => {
    test("Then it should return false", () => {
      const text = "token";
      const expectedResult = false;

      const result = getBearerToken(text);

      expect(result).toBe(expectedResult);
    });
  });

  describe("When called with no text", () => {
    test("Then it should return false", () => {
      const expectedResult = false;

      const result = getBearerToken();

      expect(result).toBe(expectedResult);
    });
  });
});
