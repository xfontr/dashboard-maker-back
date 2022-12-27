import express from "express";
import endpoints from "../../../config/endpoints";
import { getAllUsers } from "../../../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.get(endpoints.users.root, getAllUsers);

export default usersRouter;
