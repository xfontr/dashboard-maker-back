import { UserRoles } from "../modules/user/users.types";
import Actions from "../common/types/Actions";

export const roles: UserRoles[] = ["user", "admin", "superAdmin"];

const permissions: Record<UserRoles, Actions> = {
  superAdmin: {
    createToken: 4,
  },

  admin: {
    createToken: 1,
  },

  user: {},
};

export default permissions;
