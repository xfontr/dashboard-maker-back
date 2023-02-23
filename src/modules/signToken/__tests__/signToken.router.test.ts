import "../../../setupTests";
import request from "supertest";
import ENDPOINTS from "../../../config/endpoints";
import HTTP_CODES from "../../../config/errorCodes";
import ENVIRONMENT from "../../../config/environment";
import { MAIN_IDENTIFIER } from "../../../config/database";
import { mockProtoToken } from "../../../common/test-utils/mocks/mockToken";
import app from "../../../app";
import mockUser, {
  mockProtoUser,
} from "../../../common/test-utils/mocks/mockUser";

const { signTokens: tokens, users } = ENDPOINTS;
const { error, success } = HTTP_CODES;

const createSignToken = (email: string = mockProtoToken.email) =>
  request(app)
    .post(tokens.router)
    .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
    .send({ ...mockProtoToken, email });

const registerUser = (email: string = mockProtoUser.email) =>
  request(app)
    .post(users.router)
    .set("Authorization", `Bearer ${mockProtoToken.code}`)
    .send({
      ...mockProtoUser,
      email,
    });

const verifyToken = (tokenCode: string = mockProtoToken.code) =>
  request(app)
    .post(`${tokens.router}${tokens.verify}`)
    .set("Authorization", `Bearer ${tokenCode}`)
    .send({
      [MAIN_IDENTIFIER]: mockProtoToken[MAIN_IDENTIFIER],
    });

describe(`Given a ${tokens.router} route`, () => {
  describe("When requested with POST method and valid token data", () => {
    test(`Then it should respond with a status of ${success.created}`, async () => {
      const res = await createSignToken();

      expect(res.statusCode).toBe(success.created);
    });
  });

  describe("When requested with POST method and invalid token data", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app).post(tokens.router).send({ name: "Test" });

      expect(res.statusCode).toBe(error.badRequest);
    });
  });

  describe("When requested with POST method and the token already exists", () => {
    test(`Then it should respond with a status of ${error.conflict}`, async () => {
      await createSignToken();

      const res = await createSignToken();

      expect(res.statusCode).toBe(error.conflict);
    });
  });

  describe("When requested with POST method and the user is already registered", () => {
    test(`Then it should respond with a status of ${error.conflict}`, async () => {
      await createSignToken();

      await registerUser();

      const res = await createSignToken();

      expect(res.statusCode).toBe(error.conflict);
    });
  });

  describe("When requested with POST method and the request is not authorized", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await createSignToken();

      await registerUser();

      let lowAuthorityAuthToken: any;

      await request(app)
        .post(`${users.router}${users.logIn}`)
        .send({
          [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
          password: mockUser.password,
        })
        .then(({ body: { user } }) => {
          lowAuthorityAuthToken = user.token;
        });

      const res = await request(app)
        .post(tokens.router)
        .set("Authorization", `Bearer ${lowAuthorityAuthToken}`)
        .send({
          ...mockProtoToken,
          [MAIN_IDENTIFIER]: "random@random.com",
        });

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });
});

describe(`Given a ${tokens.verify} route`, () => {
  describe("When requested with POST method and valid token data", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
      await createSignToken("fake@fake.com");

      await registerUser("fake@fake.com");

      await createSignToken();

      const res = await verifyToken();

      expect(res.statusCode).toBe(success.ok);
    });
  });

  describe("When requested with POST method and invalid token data", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await createSignToken();

      const res = await verifyToken("");

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });

  describe("When requested with POST method and an non-existent token", () => {
    test(`Then it should respond with a status of ${error.notFound}`, async () => {
      const res = await verifyToken();

      expect(res.statusCode).toBe(error.notFound);
    });
  });
});
