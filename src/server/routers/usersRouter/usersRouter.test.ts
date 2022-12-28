import "../../../setupTests";
import request from "supertest";
import app from "../..";
import codes from "../../../config/codes";
import endpoints from "../../../config/endpoints";
import mockUser from "../../../test-utils/mocks/mockUser";

describe(`Given a ${endpoints.users.router} route`, () => {
  describe("When requested with GET method", () => {
    test(`Then it should respond with a status of ${codes.success.ok}`, async () => {
      const res = await request(app).get(`${endpoints.users.router}`);

      expect(res.statusCode).toBe(codes.success.ok);
    });
  });
});

describe(`Given a ${endpoints.users.router} route`, () => {
  describe("When requested with POST method and valid register data", () => {
    test(`Then it should respond with a status of ${codes.success.created}`, async () => {
      const res = await request(app).post(`${endpoints.users.router}`).send({
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      });

      expect(res.statusCode).toBe(codes.success.created);
    });
  });
});
