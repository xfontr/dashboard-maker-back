import { NextFunction, Response } from "express";
import { verifyToken } from "../services/authentication";
import Errors from "../errors/Errors";
import CustomRequest from "../types/CustomRequest";
import Payload from "../types/Payload";
import catchCodedError from "../utils/catchCodedError";
import getBearerToken from "../utils/getBearerToken";

const authentication = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const tryThis = catchCodedError(next);
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    next(Errors.users.invalidAuthToken(Error("The token provided is invalid")));
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
