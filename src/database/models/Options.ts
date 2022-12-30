import { model, Schema } from "mongoose";
import environment from "../../config/environment";
import IOptions from "../types/IOptions";

const optionsSchema = new Schema<IOptions>({
  powerToken: {
    type: String,
    required: true,
    default: environment.defaultPowerToken,
  },

  tokenLife: {
    type: Number,
    required: true,
    default: 24,
  },
});

const Options = model("Option", optionsSchema, "options");

export default Options;
