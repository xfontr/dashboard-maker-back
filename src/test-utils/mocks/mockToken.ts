import { userMainIdentifier } from "../../config/database";
import IToken from "../../database/types/IToken";
import mockUser from "./mockUser";

export const mockProtoToken: Partial<IToken> = {
  [userMainIdentifier]: mockUser[userMainIdentifier],
  code: "token",
  role: mockUser.role,
};

export const mockFullToken: IToken = {
  [userMainIdentifier]: mockUser[userMainIdentifier],
  code: "token",
  creationDate: new Date(),
  role: mockUser.role,
  isCodeRequired: true,
};
