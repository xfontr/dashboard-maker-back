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
  role: "admin",
  id: "id",
};

export default mockUser;
