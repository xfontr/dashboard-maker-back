import { model, Schema } from "mongoose";
import { userMainIdentifier } from "../../config/database";
import IToken from "../types/IToken";

const tokenSchema = new Schema<IToken>({
  [userMainIdentifier]: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  isCodeRequired: {
    type: Boolean,
    required: true,
    default: true,
  },

  creationDate: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },

  role: {
    type: String,
    required: true,
    default: "user",
  },
});

const Token = model("Token", tokenSchema, "tokens");

export default Token;
