import "../../../setupTests";
import request from "supertest";
import endpoints from "../../../config/endpoints";
import codes from "../../../config/codes";
import app from "../..";
import { mockProtoToken } from "../../../test-utils/mocks/mockToken";
import environment from "../../../config/environment";

const { tokens } = endpoints;
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
});
