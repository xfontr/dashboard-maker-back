import { NextFunction, Request, Response } from "express";
import { userMainIdentifier } from "../../config/database";
import IToken from "../../database/types/IToken";
import { compareHash } from "../../services/authentication/authentication";
import AcceptedIdentifiers from "../../types/AcceptedIdentifiers";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import CodedError from "../../utils/CodedError/CodedError";
import getBearerToken from "../../utils/getBearerToken/getBearerToken";

const invalidToken = CodedError(
  "unauthorized",
  "The registration data provided is not valid. If the error persists, please contact the administrator"
)(Error("Invalid registration token"));

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const tryThis = catchCodedError(next);
  const code = getBearerToken(req.headers.authorization);
  const userIdentifier: AcceptedIdentifiers = req.body[userMainIdentifier];

  if (!code) {
    next(invalidToken);
    return;
  }

  const dbToken: IToken[] = req.body.item;

  if (dbToken[0][userMainIdentifier] !== userIdentifier) {
    next(invalidToken);
    return;
  }

  const isTokenCorrect = await tryThis(
    compareHash,
    [code, dbToken[0].code],
    "internalServerError"
  );

  if (!isTokenCorrect) {
    next(invalidToken);
    return;
  }

  next();
};

export default checkToken;
