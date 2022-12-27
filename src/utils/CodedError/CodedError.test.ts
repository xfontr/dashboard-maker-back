import codes from "../../config/codes";
import camelToRegular from "../camelToRegular/camelToRegular";
import { ICustomError } from "../CustomError/CustomError";
import CodedError from "./CodedError";

describe("Given a CodedError function", () => {
  describe("When instantaited with a error code of 'badRequest'", () => {
    const errorCode = "badRequest";
    const defaultMessage = camelToRegular(errorCode);

    test(`Then it should return a custom error with code ${codes.error.badRequest} and a default message 'Bad Request'`, () => {
      const expectedError: ICustomError = {
        name: `Error ${codes.error.badRequest}`,
        code: codes.error.badRequest,
        message: defaultMessage,
        privateMessage: defaultMessage,
      };

      const codedError = CodedError("badRequest", Error());

      expect(codedError).toStrictEqual(expectedError);
    });
  });

  describe("When instantiated with a error code of 'badRequest', a message 'Test' and a private message 'Private'", () => {
    test(`Then it should return a custom error with code ${codes.error.badRequest} and said messages`, () => {
      const expectedError: ICustomError = {
        name: `Error ${codes.error.badRequest}`,
        code: codes.error.badRequest,
        message: "Test",
        privateMessage: "Private",
      };

      const codedError = CodedError(
        "badRequest",
        Error(expectedError.message),
        expectedError.privateMessage
      );

      expect(codedError).toStrictEqual(expectedError);
    });
  });
});
