import { UserRoles } from "../database/types/IUser";

type Actions = Partial<{
  createToken: UserRoles[];
}>;

export default Actions;
