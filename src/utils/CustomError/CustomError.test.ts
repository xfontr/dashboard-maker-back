import codes from "../../config/codes";
import camelToRegular from "../camelToRegular/camelToRegular";
import CustomError, { ICustomError } from "./CustomError";

describe("Given a CustomError function", () => {
	const errorCode = "500";
	const errorMessage = "Public error";

	describe("When instantiated with an error of message 'Public error', name '500' and private message 'Private'", () => {
		test("Then it should return an error object with said message and name", () => {
			const originalError = Error(errorMessage);
			originalError.name = errorCode;

			const expectedError: ICustomError = {
				name: errorCode,
				message: originalError.message,
				privateMessage: "Private",
			};

			const customError = CustomError(
				originalError,
				expectedError.privateMessage
			);

			expect(customError).toStrictEqual(expectedError);
		});
	});

	describe("When instantiated without parameters", () => {
		test("Then it should return an error with the default message and name", () => {
			const expectedError: ICustomError = {
				name: `Error ${codes.error.internalServerError}`,
				message: camelToRegular("internalServerError"),
				privateMessage: "Unknown error",
			};

			const customError = CustomError(Error());

			expect(customError).toStrictEqual(expectedError);
		});
	});
});
