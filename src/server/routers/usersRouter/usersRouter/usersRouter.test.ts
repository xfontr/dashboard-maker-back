import "../../../../setupTests";
import request from "supertest";
import app from "../../..";
import codes from "../../../../config/codes";
import endpoints from "../../../../config/endpoints";
import mockUser from "../../../../test-utils/mocks/mockUser";
import { userMainIdentifier } from "../../../../config/database";
import { mockProtoToken } from "../../../../test-utils/mocks/mockToken";

const { users, tokens } = endpoints;
const { success, error } = codes;

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
      await request(app).post(`${tokens.router}`).send(mockProtoToken);
      const res = await request(app)
        .post(`${users.router}`)
        .set("Authorization", `Bearer ${mockProtoToken.code}`)
        .send({
          name: mockUser.name,
          password: mockUser.password,
          email: mockUser.email,
        });

      expect(res.statusCode).toBe(success.created);
    });
  });

  describe("When requested with POST method, valid register data but a wrong token", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await request(app).post(`${tokens.router}`).send(mockProtoToken);
      const res = await request(app)
        .post(`${users.router}`)
        .set("Authorization", "Bearer wrongCode")
        .send({
          name: mockUser.name,
          password: mockUser.password,
          email: mockUser.email,
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
      await request(app).post(`${tokens.router}`).send(mockProtoToken);
      await request(app)
        .post(`${users.router}`)
        .set("Authorization", `Bearer ${mockProtoToken.code}`)
        .send({
          name: mockUser.name,
          password: mockUser.password,
          email: mockUser.email,
        });

      const res = await request(app)
        .post(`${users.router}/${users.logIn}`)
        .send({
          [userMainIdentifier]: mockUser[userMainIdentifier],
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
