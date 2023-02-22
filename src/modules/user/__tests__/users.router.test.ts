import "../../../setupTests";
import request from "supertest";
import HTTP_CODES from "../../../config/errorCodes";
import ENDPOINTS from "../../../config/endpoints";
import { MAIN_IDENTIFIER } from "../../../config/database";
import ENVIRONMENT from "../../../config/environment";
import app from "../../../app";
import { mockProtoToken } from "../../../common/test-utils/mocks/mockToken";
import mockUser, {
  mockProtoUser,
} from "../../../common/test-utils/mocks/mockUser";
import User from "../User.model";
import Payload from "../../../common/types/Payload";
import FullToken from "../utils/FullToken/FullToken";
import IUser from "../users.types";
import ISignToken from "../../signToken/signToken.types";

const { users, signTokens: tokens } = ENDPOINTS;
const { success, error } = HTTP_CODES;

const createToken = (token: Partial<ISignToken> = mockProtoToken) =>
  request(app)
    .post(tokens.router)
    .set("Authorization", `Bearer ${ENVIRONMENT.defaultPowerToken}`)
    .send(token);

const registerUser = (
  tokenCode: string = mockProtoToken.code,
  user: IUser = mockProtoUser
) =>
  request(app)
    .post(users.router)
    .set("Authorization", `Bearer ${tokenCode}`)
    .send({
      ...user,
    });

const logInUser = () =>
  request(app)
    .post(`${users.router}${users.logIn}`)
    .send({
      [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
      password: mockUser.password,
    });

describe(`Given a ${users.router} route`, () => {
  describe("When requested with GET method with a user authenticated as admin or higher", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
      await createToken({ ...mockProtoToken, role: "admin" });

      await registerUser(mockProtoToken.code, {
        ...mockProtoUser,
        role: "admin",
      });

      let token = "";

      await logInUser().then(({ body: { user } }) => {
        token = user.token;
      });

      const res = await request(app)
        .get(users.router)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(success.ok);
    });
  });

  describe("When requested with GET method with a user authenticated as user or lower", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await createToken();

      await registerUser();

      let token = "";

      await logInUser().then(({ body: { user } }) => {
        token = user.token;
      });

      const res = await request(app)
        .get(users.router)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });
});

describe(`Given a ${users.router} route`, () => {
  describe("When requested with POST method and valid register data", () => {
    test(`Then it should respond with a status of ${success.created}`, async () => {
      await createToken();

      const res = await registerUser();

      expect(res.statusCode).toBe(success.created);
    });
  });

  describe("When requested with POST method, valid register data but a wrong token", () => {
    test(`Then it should respond with a status of ${error.unauthorized}`, async () => {
      await createToken();

      const res = await registerUser("wrongCode");

      expect(res.statusCode).toBe(error.unauthorized);
    });
  });

  describe("When requested with POST method and invalid register data", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app).post(users.router).send({
        randomField: "wrong",
      });

      expect(res.statusCode).toBe(error.badRequest);
    });
  });
});

describe(`Given a ${users.logIn} route`, () => {
  describe("When requested with POST method and valid log in data", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
      await createToken();

      await registerUser();

      const res = await request(app)
        .post(`${users.router}${users.logIn}`)
        .send({
          [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
          password: mockUser.password,
        });

      expect(res.statusCode).toBe(success.ok);
    });
  });

  describe("When requested with POST method and invalid logIn data", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app)
        .post(`${users.router}${users.logIn}`)
        .send({
          name: "Name",
        });

      expect(res.statusCode).toBe(error.badRequest);
    });
  });
});

describe(`Given a ${users.refresh} route`, () => {
  describe("When requested with POST method and a valid cookie", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
      await createToken();

      await registerUser();

      await request(app)
        .post(`${users.router}${users.logIn}`)
        .send({
          [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
          password: mockUser.password,
        });

      const dbUser = await User.find({
        [MAIN_IDENTIFIER]: mockProtoToken[MAIN_IDENTIFIER],
      });

      const res = await request(app)
        .get(`${users.router}${users.refresh}`)
        .set(
          "Cookie",
          `authToken=${dbUser[0].authToken}; Path=/; Secure; HttpOnly; Expires=Thu, 26 Jan 2023 19:13:23 GMT;`
        );

      expect(res.statusCode).toBe(success.ok);
    });
  });

  describe("When requested with POST method and an invalid cookie", () => {
    test(`Then it should respond with a status of ${error.notFound}`, async () => {
      const res = await request(app)
        .get(`${users.router}${users.refresh}`)
        .set("Cookie", "authToken=invalid-cookie;");

      expect(res.statusCode).toBe(error.notFound);
    });
  });

  describe("When requested with POST method and no cookies", () => {
    test(`Then it should respond with a status of ${error.badRequest}`, async () => {
      const res = await request(app)
        .get(`${users.router}${users.refresh}`)
        .set("Cookie", "invalid cookie");

      expect(res.statusCode).toBe(error.badRequest);
    });
  });
});

describe(`Given a ${users.logOut} route`, () => {
  describe("When requested with PATCH method and a valid cookie", () => {
    test(`Then it should respond with a status of ${success.ok}`, async () => {
      await createToken();

      await registerUser();

      await request(app)
        .post(`${users.router}${users.logIn}`)
        .send({
          [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
          password: mockUser.password,
        });

      const dbUser = await User.find({
        [MAIN_IDENTIFIER]: mockProtoToken[MAIN_IDENTIFIER],
      });

      const res = await request(app)
        .patch(`${users.router}${users.logOut}`)
        .set(
          "Cookie",
          `authToken=${dbUser[0].authToken}; Path=/; Secure; HttpOnly; Expires=Thu, 26 Jan 2023 19:13:23 GMT;`
        );

      expect(res.statusCode).toBe(success.ok);
    });

    describe("When requested with PATCH method and an invalid cookie", () => {
      test(`Then it should respond with a status of ${error.notFound}`, async () => {
        const res = await request(app)
          .patch(`${users.router}${users.logOut}`)
          .set("Cookie", "authToken=invalid-cookie;");

        expect(res.statusCode).toBe(error.notFound);
      });
    });

    describe("When requested with PATCH method and no cookies", () => {
      test(`Then it should respond with a status of ${error.badRequest}`, async () => {
        const res = await request(app)
          .patch(`${users.router}${users.logOut}`)
          .set("Cookie", "invalid cookie");

        expect(res.statusCode).toBe(error.badRequest);
      });
    });
  });
});
