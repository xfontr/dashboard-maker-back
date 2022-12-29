import { UserRoles } from "./IUser";

type IToken = {
  email: string;
  token: string;
  creationDate: Date;
  role: UserRoles;
};

export default IToken;
