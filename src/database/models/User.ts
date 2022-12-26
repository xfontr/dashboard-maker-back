import { model, Schema } from "mongoose";
import IUser, {
  UserAddress,
  UserName,
  UserRequiredData,
  UserRoles,
} from "../types/IUser";

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
};

const userNameData: Record<keyof UserName, object> = {
  name: String,
  firstName: String,
  secondName: String,
  username: String,
};

const userAddressData: Record<keyof UserAddress, object> = {
  city: String,
  postalCode: String,
  street: String,
  stairs: String,
  block: String,
  addressExtraInfo: String,
};

const userSchema = new Schema<IUser>({
  ...requiredData,
  ...userNameData,
  ...userAddressData,
});

export default model("User", userSchema, "users");
