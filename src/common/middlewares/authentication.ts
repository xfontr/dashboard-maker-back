import { NextFunction, Response } from "express";
import userErrors from "../../modules/user/users.errors";
import { verifyToken } from "../services/authentication";
import CustomRequest from "../types/CustomRequest";
import Payload from "../types/Payload";
import catchCodedError from "../utils/catchCodedError";
import getBearerToken from "../utils/getBearerToken";

/** Verifies the token out of the authorization header */
const authentication = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    next(userErrors.invalidAuthToken(Error("The token provided is invalid")));
    return;
  }

  const tokenData = await tryThis<string, Payload>(
    verifyToken,
    [token],
    "badRequest"
  );
  if (!tokenData) return;

  req.payload = tokenData;

  next();
};

export default authentication;
