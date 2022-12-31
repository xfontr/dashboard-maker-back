import "../../../setupTests";
import request from "supertest";
import ERROR_CODES from "../../../config/errorCodes";
import ENDPOINTS from "../../../config/endpoints";
import { USER_MAIN_IDENTIFIER } from "../../../config/database";
import ENVIRONMENT from "../../../config/environment";
import app from "../../../app";
import { mockProtoToken } from "../../../common/test-utils/mocks/mockToken";
import mockUser, {
  mockProtoUser,
} from "../../../common/test-utils/mocks/mockUser";

const { users, tokens } = ENDPOINTS;
const { success, error } = ERROR_CODES;

describe(`Given a ${users.router} route`, () => {
  describe("When requested with GET method", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
      const res = await request(app).get(`${users.router}`);

      expect(res.statusCode).toBe(success.ok);
    });
  });
});

describe(`Given a ${users.router} route`, () => {
  describe("When requested with POST method and valid register data", () => {
    test(`Then it should respond with a status of ${success.created}`, async () => {
      await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
        .send(mockProtoToken);

      const res = await request(app)
        .post(`${users.router}`)
        .set("Authorization", `Bearer ${mockProtoToken.code}`)
        .send({
          ...mockProtoUser,
        });

      expect(res.statusCode).toBe(success.created);
    });
  });

  describe("When requested with POST method, valid register data but a wrong token", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await request(app)
        .post(`${tokens.router}`)
        .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
        .send(mockProtoToken);

      const res = await request(app)
        .post(`${users.router}`)
        .set("Authorization", "Bearer wrongCode")
        .send({
          ...mockProtoUser,
        });

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });

  describe("When requested with POST method and invalid register data", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app).post(`${users.router}`).send({
        name: mockUser.name,
      });

      expect(res.statusCode).toBe(error.badRequest);
    });
  });
});

describe(`Given a ${users.logIn} route`, () => {
  describe("When requested with POST method and valid log in data", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
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
        .post(`${users.router}/${users.logIn}`)
        .send({
          [USER_MAIN_IDENTIFIER]: mockUser[USER_MAIN_IDENTIFIER],
          password: mockUser.password,
        });

      expect(res.statusCode).toBe(success.ok);
    });
  });

  describe("When requested with POST method and invalid logIn data", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app)
        .post(`${users.router}/${users.logIn}`)
        .send({
          name: "Name",
        });

      expect(res.statusCode).toBe(error.badRequest);
    });
  });
});
