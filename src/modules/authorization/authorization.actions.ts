import { CreateToken, GetAllUsers } from "./authorization.store";
import { ActionName, ActionOptions } from "./authorization.types";
import { UserRoles } from "../user/users.types";

const BASE_ACTIONS: Record<ActionName, ActionOptions> = {
  ...CreateToken({ isAuthorized: false, affectsUsers: [] }),
  ...GetAllUsers({ isAuthorized: true }),
};

const AUTHORIZED_ACTIONS: Record<
  UserRoles,
  Record<ActionName, ActionOptions>
> = {
  superAdmin: {
    ...BASE_ACTIONS,
    ...CreateToken({
      isAuthorized: true,
      affectsUsers: ["user", "admin", "superAdmin"],
    }),
  },
  owner: {
    ...BASE_ACTIONS,
    ...CreateToken({ isAuthorized: true, affectsUsers: ["user", "admin"] }),
  },
  admin: {
    ...BASE_ACTIONS,
    ...CreateToken({ isAuthorized: true, affectsUsers: ["user"] }),
  },
  user: {
    ...BASE_ACTIONS,
    ...GetAllUsers({ isAuthorized: false }),
  },
};

export default AUTHORIZED_ACTIONS;
