import { model, Schema } from "mongoose";
import { MAIN_IDENTIFIER } from "../../config/database";
import IToken from "./token.types";

const tokenSchema = new Schema<IToken>({
  [MAIN_IDENTIFIER]: {
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
