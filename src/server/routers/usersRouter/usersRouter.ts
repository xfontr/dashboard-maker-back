import express from "express";
import endpoints from "../../../config/endpoints";
import {
  getAllUsers,
  registerUser,
} from "../../../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.get(endpoints.users.root, getAllUsers);
usersRouter.post(endpoints.users.root, registerUser);

export default usersRouter;
