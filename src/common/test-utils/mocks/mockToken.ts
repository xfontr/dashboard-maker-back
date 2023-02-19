import { MAIN_IDENTIFIER } from "../../../config/database";
import ISignToken from "../../../modules/signToken/signToken.types";
import mockUser from "./mockUser";

export const mockProtoToken: Partial<ISignToken> = {
  [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
  code: "token",
  role: mockUser.role,
};

export const mockFullToken: ISignToken = {
  [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
  code: "token",
  creationDate: new Date(),
  role: mockUser.role,
  isCodeRequired: true,
};
