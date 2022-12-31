import { Joi } from "express-validation";
import userData from "../../config/userData";
import IUser, { UserRequiredData } from "./users.types";

const { email, name } = userData;

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
    role: Joi.string().required(),
  }),
};
