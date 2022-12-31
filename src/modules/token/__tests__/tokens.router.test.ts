import "../../../setupTests";
import request from "supertest";
import ENDPOINTS from "../../../config/endpoints";
import ERROR_CODES from "../../../config/errorCodes";
import ENVIRONMENT from "../../../config/environment";
import { USER_MAIN_IDENTIFIER } from "../../../config/database";
import { mockProtoToken } from "../../../common/test-utils/mocks/mockToken";
import app from "../../../app";
import mockUser, {
  mockProtoUser,
} from "../../../common/test-utils/mocks/mockUser";

const { tokens, users } = ENDPOINTS;
const { error, success } = ERROR_CODES;

describe(`Given a ${tokens.router} route`, () => {
  describe("When requested with POST method and valid token data", () => {
    test(`Then it should respond with a status of ${success.created}`, async () => {
      const res = await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
        .send(mockProtoToken);

      expect(res.statusCode).toBe(success.created);
    });
  });

  describe("When requested with POST method and invalid token data", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app)
        .post(`${tokens.router}`)
        .send({ name: "Test" });

      expect(res.statusCode).toBe(error.badRequest);
    });
  });

  describe("When requested with POST method and the user is already registered", () => {
    test(`Then it should respond with a status of ${error.conflict}`, async () => {
      await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
        .send(mockProtoToken);

      await request(app)
        .post(`${users.router}`)
        .set("Authorization", `Bearer ${mockProtoToken.code}`)
        .send({
          ...mockProtoUser,
        });

      const res = await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
        .send(mockProtoToken);

      expect(res.statusCode).toBe(error.conflict);
    });
  });

  describe("When requested with POST method and the request is not authorized", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
        .send(mockProtoToken);

      await request(app)
        .post(`${users.router}`)
        .set("Authorization", `Bearer ${mockProtoToken.code}`)
        .send({
          ...mockProtoUser,
        });

      let lowAuthorityAuthToken: any;

      await request(app)
        .post(`${users.router}/${users.logIn}`)
        .send({
          [USER_MAIN_IDENTIFIER]: mockUser[USER_MAIN_IDENTIFIER],
          password: mockUser.password,
        })
        .then(({ body: { user } }) => {
          lowAuthorityAuthToken = user.token;
        });

      const res = await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${lowAuthorityAuthToken}`)
        .send({
          ...mockProtoToken,
          [USER_MAIN_IDENTIFIER]: "random@random.com",
        });

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });
});
