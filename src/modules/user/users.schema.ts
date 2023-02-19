import { Joi } from "express-validation";
import INPUT_RULES from "../../config/inputRules";
import IUser, { UserRequiredData } from "./users.types";

const { email, name } = INPUT_RULES;

export const logInSchema = {
  body: Joi.object<Partial<UserRequiredData>>({
    password: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
  }),
};

export const registerSchema = {
  body: Joi.object<Partial<IUser>>({
    name: Joi.string().min(name.min).max(name.max).required(),
    password: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
    role: Joi.string().valid("user", "admin").required(),
    surname: Joi.string().min(name.min).max(name.max),
    address: Joi.string().min(5).max(70),
    city: Joi.string().min(3).max(40),
    postalCode: Joi.number().min(3).max(12),
  }),
};
