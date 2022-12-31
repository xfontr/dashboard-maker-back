import { USER_MAIN_IDENTIFIER } from "../../../config/database";
import IToken from "../../../modules/token/token.types";
import mockUser from "./mockUser";

export const mockProtoToken: Partial<IToken> = {
  [USER_MAIN_IDENTIFIER]: mockUser[USER_MAIN_IDENTIFIER],
  code: "token",
  role: mockUser.role,
};

export const mockFullToken: IToken = {
  [USER_MAIN_IDENTIFIER]: mockUser[USER_MAIN_IDENTIFIER],
  code: "token",
  creationDate: new Date(),
  role: mockUser.role,
  isCodeRequired: true,
};
