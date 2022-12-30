import express from "express";
import endpoints from "../../../../config/endpoints";
import {
  getAllUsers,
  logInUser,
  registerUser,
} from "../../../../controllers/usersControllers/usersControllers";
import registrationToken from "../../../../middlewares/superToken/superToken";
import logInSchema from "../../../../schemas/logIn.schema";
import registerSchema from "../../../../schemas/register.schema";
import validateRequest from "../../../../services/validateRequest/validateRequest";

const usersRouter = express.Router();

const { root, logIn } = endpoints.users;

usersRouter.get(root, getAllUsers);

usersRouter.post(
  root,
  validateRequest(registerSchema),
  registrationToken,
  registerUser
);

usersRouter.post(logIn, validateRequest(logInSchema), logInUser);

export default usersRouter;
