import express from "express";
import endpoints from "../../../config/endpoints";
import {
  getAllUsers,
  logInUser,
  registerUser,
} from "../../../controllers/usersControllers";
import registerSchema from "../../../schemas/register.schema";
import validateRequest from "../../../services/validateRequest/validateRequest";

const usersRouter = express.Router();

usersRouter.get(endpoints.users.root, getAllUsers);

usersRouter.post(
  endpoints.users.root,
  validateRequest(registerSchema),
  registerUser
);

usersRouter.post(
  endpoints.users.logIn,
  // validateRequest(registerSchema),
  logInUser
);

export default usersRouter;
