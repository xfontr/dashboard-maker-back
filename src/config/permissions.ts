import { UserRoles } from "../modules/user/users.types";
import Actions from "../common/types/Actions";

export const roles: UserRoles[] = ["user", "admin", "superAdmin"];

/**
 * There are 4 power levels, from 1 to 4. Each action can have assigned a power
 * level within that range. A power level translates to: "All the user roles
 * which index is inferior to the selected one"
 *
 * @example
 *   For a power level of 1, the roles affected will be ["user"]. If 2, ["user", "admin"] and so on
 */

const PERMISSIONS: Record<UserRoles, Actions> = {
  superAdmin: {
    createToken: 4,
  },

  admin: {
    createToken: 1,
  },

  user: {},
};

export default PERMISSIONS;
