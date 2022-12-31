import mockUser from "../../../../common/test-utils/mocks/mockUser";
import Token from "./FullToken";

const mockCreateToken = jest.fn().mockReturnValue("#");

jest.mock("../../../../common/services/authentication", () => ({
  ...jest.requireActual("../../../../common/services/authentication"),
  createToken: () => mockCreateToken(),
}));

describe("Given a prepareToken function", () => {
  describe("When called with a user as an argument", () => {
    test("Then it should call the createToken function", () => {
      Token(mockUser);

      expect(mockCreateToken).toHaveBeenCalled();
    });

    test("Then it should return an object with the tokenized user", () => {
      const expectedToken = {
        user: {
          token: mockCreateToken(),
        },
      };

      const result = Token(mockUser);

      expect(result).toStrictEqual(expectedToken);
    });
  });
});
