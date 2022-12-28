import { Joi } from "express-validation";
import userData from "../config/userData";

const { email, name } = userData;

export default {
  body: Joi.object({
    name: Joi.string().min(name.min).max(name.max).required(),
    password: Joi.string().required(),
    email: Joi.string().min(email.min).max(email.max).required(),
  }),
};
