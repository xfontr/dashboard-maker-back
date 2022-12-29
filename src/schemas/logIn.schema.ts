import { Joi } from "express-validation";
import userData from "../config/userData";
import { UserRequiredData } from "../database/types/IUser";

const { email } = userData;

const logInSchema = {
  body: Joi.object<Partial<UserRequiredData>>({
    password: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
  }),
};

export default logInSchema;
