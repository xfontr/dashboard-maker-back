import { UserRoles } from "../database/types/IUser";

type Actions = Partial<{
  createToken: UserRoles[];
}>;

interface Roles {
  [roleLevel: string]: {
    name: UserRoles;
    actions?: Actions;
  };
}

export default Roles;
