import { MAIN_IDENTIFIER } from "../../config/database";
import { UserRoles } from "../user/users.types";

type IToken = {
  [MAIN_IDENTIFIER]: string;
  code: string;
  creationDate: Date;
  role: UserRoles;
  isCodeRequired: boolean;
};

export default IToken;
