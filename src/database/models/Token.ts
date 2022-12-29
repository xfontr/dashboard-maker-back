import { model, Schema } from "mongoose";
import { userMainIdentifier } from "../../config/database";
import IToken from "../types/IToken";

const tokenSchema = new Schema<IToken>({
  [userMainIdentifier]: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
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
