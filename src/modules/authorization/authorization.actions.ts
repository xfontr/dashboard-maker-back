import { CreateToken, GetAllUsers } from "./authorization.store";
import { ActionName, ActionOptions } from "./authorization.types";
import { UserRoles } from "../user/users.types";

const AUTHORIZED_ACTIONS: Record<
  UserRoles,
  Record<ActionName, ActionOptions>
> = {
  superAdmin: {
    ...CreateToken({
      isAuthorized: true,
      affectsUsers: ["user", "admin", "superAdmin"],
    }),
    ...GetAllUsers({ isAuthorized: true }),
  },
  owner: {
    ...CreateToken({ isAuthorized: true, affectsUsers: ["user", "admin"] }),
    ...GetAllUsers({ isAuthorized: true }),
  },
  admin: {
    ...CreateToken({ isAuthorized: true, affectsUsers: ["user"] }),
    ...GetAllUsers({ isAuthorized: true }),
  },
  user: {
    ...CreateToken({ isAuthorized: false }),
    ...GetAllUsers({ isAuthorized: false }),
  },
};

export default AUTHORIZED_ACTIONS;
