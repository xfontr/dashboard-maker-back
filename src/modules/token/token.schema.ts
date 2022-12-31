import { Joi } from "express-validation";
import userData from "../../config/userData";
import IToken from "./token.types";

const { email } = userData;

const tokenSchema = {
  body: Joi.object<Partial<IToken>>({
    code: Joi.string().required(),
    email: Joi.string()
      .min(email.min)
      .max(email.max)
      .email({ minDomainSegments: 2 })
      .required(),
    role: Joi.string().required(),
  }),
};

export default tokenSchema;
