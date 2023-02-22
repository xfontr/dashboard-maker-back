export type UserRoles = "user" | "admin" | "owner" | "superAdmin";

export type UserRequiredData = {
  id?: string;
  password: string;
  email: string;
  role?: UserRoles;
  authToken?: string;
};

export type UserName = Partial<{
  name: string;
  surname: string;
  username: string;
}>;

export type UserAddress = Partial<{
  city: string;
  postalCode: string;
  street: string;
  stairs: string;
  block: string;
  address: string;
  addressExtraInfo: string;
}>;

interface IUser extends UserRequiredData, UserName, UserAddress {}

export default IUser;
