export type UserRoles = "user" | "admin" | "superAdmin";

export type UserRequiredData = {
  id?: string;
  password: string;
  email: string;
  role?: UserRoles;
};

export type UserName = Partial<{
  name: string;
  firstName: string;
  secondName: string;
  username: string;
}>;

export type UserAddress = Partial<{
  city: string;
  postalCode: string;
  street: string;
  stairs: string;
  block: string;
  addressExtraInfo: string;
}>;

interface IUser extends UserRequiredData, UserName, UserAddress {}

export default IUser;
