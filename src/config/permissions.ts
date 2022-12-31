import { UserRoles } from "../database/types/IUser";
import Actions from "../types/Actions";

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
