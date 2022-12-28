import express from "express";
import endpoints from "../../../config/endpoints";
import {
  getAllUsers,
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

export default usersRouter;
