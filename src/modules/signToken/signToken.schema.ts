import { Joi } from "express-validation";
import INPUT_RULES from "../../config/inputRules";
import ISignToken from "./signToken.types";

const { email } = INPUT_RULES;

export const signTokenSchema = {
  body: Joi.object<Partial<ISignToken>>({
    code: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
    role: Joi.string().valid("user", "admin").required(),
    isCodeRequired: Joi.boolean(),
  }),
};

export const verifySignTokenSchema = {
  body: Joi.object<Partial<ISignToken>>({
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
  }),
};
