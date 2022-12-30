import { UserRoles } from "../database/types/IUser";
import Actions from "../types/Actions";

const roles: Record<UserRoles, Actions> = {
  superAdmin: {
    createToken: ["admin", "user"],
  },

  admin: {
    createToken: ["user"],
  },

  user: {},
};

export default roles;
