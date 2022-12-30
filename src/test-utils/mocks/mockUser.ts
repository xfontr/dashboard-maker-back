import IUser from "../../database/types/IUser";

export const mockProtoUser: IUser = {
  name: "Name",
  email: "email@email.com",
  password: "adminadmin",
  role: "admin",
};

const mockUser: IUser = {
  name: "Name",
  email: "email@email.com",
  password: "adminadmin",
  role: "user",
  id: "id",
};

export const mockUserSuperAdmin: IUser = { ...mockUser, role: "superAdmin" };
export const mockUserAdmin: IUser = { ...mockUser, role: "admin" };

export default mockUser;
