import { model, Schema } from "mongoose";
import ENVIRONMENT from "../../config/environment";
import IOptions from "./options.types";

const optionsSchema = new Schema<IOptions>({
  powerToken: {
    type: String,
    required: true,
    default: ENVIRONMENT.defaultPowerToken,
  },

  tokenLife: {
    type: Number,
    required: true,
    default: 24,
  },
});

const Options = model("Option", optionsSchema, "options");

export default Options;
