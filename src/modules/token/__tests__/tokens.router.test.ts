import "../../../setupTests";
import request from "supertest";
import endpoints from "../../../config/endpoints";
import codes from "../../../config/codes";
import environment from "../../../config/environment";
import { userMainIdentifier } from "../../../config/database";
import { mockProtoToken } from "../../../common/test-utils/mocks/mockToken";
import app from "../../../app";
import mockUser, {
  mockProtoUser,
} from "../../../common/test-utils/mocks/mockUser";

const { tokens, users } = endpoints;
const { error, success } = codes;

describe(`Given a ${tokens.router} route`, () => {
  describe("When requested with POST method and valid token data", () => {
    test(`Then it should respond with a status of ${success.created}`, async () => {
      const res = await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${environment.defaultPowerToken}`)
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
        .set("Authorization", `Bearer ${environment.defaultPowerToken}`)
        .send(mockProtoToken);

      await request(app)
        .post(`${users.router}`)
        .set("Authorization", `Bearer ${mockProtoToken.code}`)
        .send({
          ...mockProtoUser,
        });

      const res = await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${environment.defaultPowerToken}`)
        .send(mockProtoToken);

      expect(res.statusCode).toBe(error.conflict);
    });
  });

  describe("When requested with POST method and the request is not authorized", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${environment.defaultPowerToken}`)
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
          [userMainIdentifier]: mockUser[userMainIdentifier],
          password: mockUser.password,
        })
        .then(({ body: { user } }) => {
          lowAuthorityAuthToken = user.token;
        });

      const res = await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${lowAuthorityAuthToken}`)
        .send({ ...mockProtoToken, [userMainIdentifier]: "random@random.com" });

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });
});
