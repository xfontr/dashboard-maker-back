import { UserRoles } from "./IUser";

type IToken = {
  email: string;
  code: string;
  creationDate: Date;
  role: UserRoles;
  isCodeRequired: boolean;
};

export default IToken;
