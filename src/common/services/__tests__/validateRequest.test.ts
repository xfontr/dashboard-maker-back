import { EvOptions, schema as Schema } from "express-validation";
import validateRequest from "../validateRequest";

const mockValidate = jest.fn().mockReturnValue("test");

jest.mock("express-validation", () => ({
  ...jest.requireActual("express-validation"),
  validate: (...args: unknown[]) => mockValidate(...args),
}));

describe("Given a validateRequest function", () => {
  describe("When called with a validator, schema and options", () => {
    test("Then it should call the validator with said schema and options", () => {
      const schema = {} as Schema;
      const options = {} as EvOptions;
      const joiRoot = { abortEarly: false };

      validateRequest(schema, options, joiRoot);

      expect(mockValidate).toHaveBeenCalledWith(schema, options, joiRoot);
    });
  });
});
