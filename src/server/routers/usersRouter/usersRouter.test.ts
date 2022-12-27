import "../../../setupTests";
import request from "supertest";
import app from "../..";
import codes from "../../../config/codes";
import endpoints from "../../../config/endpoints";

describe(`Given a /users${endpoints.users.root} route`, () => {
  describe("When requested with GET method", () => {
    test(`Then it should respond with a status of ${codes.success.ok}`, async () => {
      const res = await request(app).get("/users/");

      expect(res.statusCode).toBe(codes.success.ok);
    });
  });
});
