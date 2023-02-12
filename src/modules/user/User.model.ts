import { model, Schema } from "mongoose";
import IUser, {
  UserAddress,
  UserName,
  UserRequiredData,
  UserRoles,
} from "./users.types";

const requiredData: Omit<Record<keyof UserRequiredData, object>, "id"> = {
  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    default: "user" as UserRoles,
  },

  authToken: {
    type: String,
    required: false,
  },
};

const userNameData: Record<keyof UserName, object> = {
  name: String,
  surname: String,
  username: String,
};

const userAddressData: Record<keyof UserAddress, object> = {
  city: String,
  postalCode: String,
  street: String,
  stairs: String,
  block: String,
  addressExtraInfo: String,
  address: String,
};

const userSchema = new Schema<IUser>({
  ...requiredData,
  ...userNameData,
  ...userAddressData,
});

const User = model("User", userSchema, "users");

export default User;
