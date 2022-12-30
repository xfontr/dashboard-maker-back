import permissions, { roles } from "../../config/permissions";
import { UserRoles } from "../../database/types/IUser";

export default (
  (roleList: UserRoles[], permissionsConfig: typeof permissions) =>
  (role: UserRoles): UserRoles[] =>
    roleList.slice(0, permissionsConfig[role].createToken ?? 0)
)(roles, permissions);
