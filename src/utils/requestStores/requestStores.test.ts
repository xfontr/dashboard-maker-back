import { mockFullToken } from "../../test-utils/mocks/mockToken";
import mockUser from "../../test-utils/mocks/mockUser";
import CustomRequest from "../../types/CustomRequest";
import Payload from "../../types/Payload";
import requestStores from "./requestStores";

const { token, payload, authority, user } = requestStores;

describe("Given a token method", () => {
  describe("When called with a custom request and a token item", () => {
    test("Then it should assign said item to the request 'token' attribute", () => {
      const req = {} as CustomRequest;

      token(req, mockFullToken);

      expect(req.token).toStrictEqual(mockFullToken);
    });
  });
});

describe("Given a payload method", () => {
  describe("When called with a custom request and a payload item", () => {
    test("Then it should assign said item to the request 'payload' attribute", () => {
      const req = {} as CustomRequest;
      const mockPayload: Payload = {
        email: mockUser.email,
        id: mockUser.id,
      };

      payload(req, mockPayload);

      expect(req.payload).toStrictEqual(mockPayload);
    });
  });
});

describe("Given a authority method", () => {
  describe("When called with a custom request and a authority item", () => {
    test("Then it should assign said item to the request 'authority' attribute", () => {
      const req = {} as CustomRequest;

      authority(req, mockUser);

      expect(req.authority).toStrictEqual(mockUser);
    });
  });
});

describe("Given a user method", () => {
  describe("When called with a custom request and a user item", () => {
    test("Then it should assign said item to the request 'user' attribute", () => {
      const req = {} as CustomRequest;

      user(req, mockUser);

      expect(req.user).toStrictEqual(mockUser);
    });
  });
});
