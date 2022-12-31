import { userMainIdentifier } from "../../../config/database";
import IUser from "../../../modules/user/users.types";

export const mockProtoUser: IUser = {
  name: "Name",
  [userMainIdentifier]: "email@email.com",
  password: "adminadmin",
  role: "user",
};

const mockUser: IUser = {
  name: "Name",
  [userMainIdentifier]: "email@email.com",
  password: "adminadmin",
  role: "user",
  id: "id",
};

export const mockUserSuperAdmin: IUser = { ...mockUser, role: "superAdmin" };
export const mockUserAdmin: IUser = { ...mockUser, role: "admin" };

export default mockUser;
