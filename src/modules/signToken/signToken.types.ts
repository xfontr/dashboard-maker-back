import { UserRoles } from "../user/users.types";

type ISignToken = {
  email: string;
  code: string;
  creationDate: Date;
  role: UserRoles;
  isCodeRequired: boolean;
};

export default ISignToken;
