import express from "express";
import endpoints from "../../../config/endpoints";
import generateToken from "../../../controllers/tokensControllers/tokensControllers";

const { root } = endpoints.tokens;

const tokensRouter = express.Router();

tokensRouter.post(root, generateToken);

export default tokensRouter;
