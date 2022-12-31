import { UserRoles } from "../user/users.types";

type IToken = {
  email: string;
  code: string;
  creationDate: Date;
  role: UserRoles;
  isCodeRequired: boolean;
};

export default IToken;
