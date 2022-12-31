import { Response } from "express";
import Errors from "../../errors/Errors";
import CustomRequest from "../../types/CustomRequest";
import Payload from "../../types/Payload";
import camelToRegular from "../../utils/camelToRegular";
import CodedError from "../../utils/CodedError";
import authentication from "../authentication";

const mockJwtPayload = { id: "", iat: 1512341253 };
let mockVerify = jest.fn().mockReturnValue(mockJwtPayload);

jest.mock("jsonwebtoken", () => ({
  verify: (token: string) => mockVerify(token),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a authentication middleware", () => {
  const req = {
    payload: {} as Payload,
    headers: {
      authorization: "Bearer token",
    },
  } as CustomRequest;

  const res = {
    status: jest.fn(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;

  const next = jest.fn();

  describe("When called with req, res and next as arguments", () => {
    test("Then it should call the next function and update the request payload", async () => {
      await authentication(req, res as Response, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.payload).toStrictEqual(mockJwtPayload);
    });

    describe("And there is no valid token at the header", () => {
      test("Then it should call next with an error", async () => {
        const invalidReq = {
          payload: {} as Payload,
          headers: {
            authorization: "#",
          },
        } as CustomRequest;

        const error = Error("The token provided is invalid");

        await authentication(invalidReq, res as Response, next);

        expect(next).toHaveBeenCalledWith(Errors.users.invalidAuthToken(error));
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe("And the token validation fails", () => {
      test("Then it should call next with an error", async () => {
        mockVerify = jest.fn().mockRejectedValue(new Error());

        await authentication(req, res as Response, next);

        expect(next).toHaveBeenCalledWith(
          CodedError("badRequest", camelToRegular("badRequest"))(new Error())
        );
        expect(next).toHaveBeenCalledTimes(1);
      });
    });
  });
});
