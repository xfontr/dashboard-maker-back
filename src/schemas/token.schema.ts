import { Joi } from "express-validation";
import userData from "../config/userData";
import IToken from "../database/types/IToken";

const { email } = userData;

const tokenSchema = {
  body: Joi.object<Partial<IToken>>({
    code: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
  }),
};

export default tokenSchema;
