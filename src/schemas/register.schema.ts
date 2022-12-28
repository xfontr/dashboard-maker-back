import { Joi } from "express-validation";
import userData from "../config/userData";
import IUser from "../database/types/IUser";

const { email, name } = userData;

const registerSchema = {
  body: Joi.object<Partial<IUser>>({
    name: Joi.string().min(name.min).max(name.max).required(),
    password: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
  }),
};

export default registerSchema;
