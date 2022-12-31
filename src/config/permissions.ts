import { UserRoles } from "../modules/user/users.types";
import Actions from "../common/types/Actions";

export const roles: UserRoles[] = ["user", "admin", "superAdmin"];

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
