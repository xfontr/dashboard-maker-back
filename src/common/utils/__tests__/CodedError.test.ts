import ERROR_CODES from "../../../config/errorCodes";
import camelToRegular from "../camelToRegular";
import { ICustomError } from "../CustomError";
import CodedError from "../CodedError";

describe("Given a CodedError function", () => {
  describe("When instantiated with a error code of 'badRequest'", () => {
    const errorCode = "badRequest";
    const defaultMessage = camelToRegular(errorCode);

    test(`Then it should return a custom error with code ${ERROR_CODES.error.badRequest} and a default message 'Bad Request'`, () => {
      const expectedError: ICustomError = {
        name: `Error ${ERROR_CODES.error.badRequest}`,
        code: ERROR_CODES.error.badRequest,
        message: defaultMessage,
        publicMessage:
          "Something went wrong. Please contact the administrator to address the issue",
      };

      const codedError = CodedError("badRequest")(Error());

      expect({ ...codedError }).toStrictEqual(expectedError);
    });
  });

  describe("When instantiated with a error code of 'badRequest', a message 'Test' and a private message 'Private'", () => {
    test(`Then it should return a custom error with code ${ERROR_CODES.error.badRequest} and said messages`, () => {
      const expectedError: ICustomError = {
        name: `Error ${ERROR_CODES.error.badRequest}`,
        code: ERROR_CODES.error.badRequest,
        message: "Test",
        publicMessage: "Private",
      };

      const codedError = CodedError(
        "badRequest",
        expectedError.publicMessage
      )(Error(expectedError.message));

      expect({ ...codedError }).toStrictEqual(expectedError);
    });
  });
});
