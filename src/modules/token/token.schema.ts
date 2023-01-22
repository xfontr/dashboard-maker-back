import { Joi } from "express-validation";
import INPUT_RULES from "../../config/inputRules";
import IToken from "./token.types";

const { email } = INPUT_RULES;

export const tokenSchema = {
  body: Joi.object<Partial<IToken>>({
    code: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
    role: Joi.string().required(),
    isCodeRequired: Joi.boolean(),
  }),
};

export const verifyTokenSchema = {
  body: Joi.object<Partial<IToken>>({
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
  }),
};
