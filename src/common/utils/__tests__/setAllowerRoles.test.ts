import setAllowedRoles from "../setAllowedRoles";

describe("Given a setAllowedRoles function", () => {
  describe("When called with a user role", () => {
    test("Then it should return a list of roles that the user can manage", () => {
      const expectedAllowedRoles = ["user"];

      const allowedRoles = setAllowedRoles("admin");

      expect(allowedRoles).toStrictEqual(expectedAllowedRoles);
    });
  });
});
