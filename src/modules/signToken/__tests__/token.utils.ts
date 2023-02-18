import ENVIRONMENT from "../../../config/environment";
import { UserRoles } from "../../user/users.types";
import isAuthorizedToRequest from "../signToken.utils";

describe("Given a isAuthorizedToRequest function", () => {
  describe("When called with a requestor role of 'admin', and a requested role of 'user'", () => {
    test("Then it should return true", () => {
      const requestorRole: UserRoles = "admin";
      const requestedRole: UserRoles = "user";

      const result = isAuthorizedToRequest(requestorRole, requestedRole);

      expect(result).toBeTruthy();
    });
  });

  describe("When called with a requestor role of 'user', and a requested role of 'admin'", () => {
    test("Then it should return false", () => {
      const requestorRole: UserRoles = "user";
      const requestedRole: UserRoles = "admin";

      const result = isAuthorizedToRequest(requestorRole, requestedRole);

      expect(result).toBeFalsy();
    });
  });

  describe("When called with a requestor role of 'user', a requested role of 'admin' and a power user email", () => {
    test("Then it should return true", () => {
      const requestorRole: UserRoles = "user";
      const requestedRole: UserRoles = "admin";

      const result = isAuthorizedToRequest(
        requestorRole,
        requestedRole,
        ENVIRONMENT.defaultPowerEmail
      );

      expect(result).toBeTruthy();
    });
  });
});
