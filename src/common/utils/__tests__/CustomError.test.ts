import ERROR_CODES from "../../../config/errorCodes";
import camelToRegular from "../camelToRegular";
import CustomError, { ICustomError } from "../CustomError";

describe("Given a CustomError function", () => {
  const errorCode = "500";
  const errorMessage = "Public error";

  describe("When instantiated with an error of message 'Public error', name '500' and private message 'Private'", () => {
    test("Then it should return an error object with said message and name", () => {
      const originalError = Error(errorMessage);
      originalError.name = errorCode;

      const expectedError: ICustomError = {
        name: `Error ${errorCode}`,
        code: +errorCode,
        message: originalError.message,
        publicMessage: "Private",
      };

      const customError = CustomError(
        originalError,
        +errorCode,
        expectedError.publicMessage
      );

      expect({ ...customError }).toStrictEqual(expectedError);
    });
  });

  describe("When instantiated without parameters", () => {
    test("Then it should return an error with the default message and name", () => {
      const expectedError: ICustomError = {
        name: `Error ${ERROR_CODES.error.internalServerError}`,
        code: ERROR_CODES.error.internalServerError,
        message: "Unknown error",
        publicMessage: camelToRegular("internalServerError"),
      };

      const customError = CustomError(Error());

      expect({ ...customError }).toStrictEqual(expectedError);
    });
  });
});
