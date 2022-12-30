import { NextFunction, Request, Response } from "express";
import { userMainIdentifier } from "../../config/database";
import Token from "../../database/models/Token";
import IToken from "../../database/types/IToken";
import { compareHash } from "../../services/authentication/authentication";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import AcceptedIdentifiers from "../../types/AcceptedIdentifiers";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import CodedError from "../../utils/CodedError/CodedError";
import getBearerToken from "../../utils/getBearerToken/getBearerToken";

const ServeToken = ServeDatabase<IToken>(Token);

const invalidToken = CodedError(
  "unauthorized",
  "The registration data provided is not valid. If the error persists, please contact the administrator"
)(Error("Invalid registration token"));

const notFoundToken = CodedError(
  "notFound",
  "The registration data provided is not valid. If the error persists, please contact the administrator"
)(Error("The token doesn't exist"));

const superToken = async (req: Request, res: Response, next: NextFunction) => {
  const TokenService = ServeToken(next);

  const tryThis = catchCodedError(next);
  const code = getBearerToken(req.headers.authorization);
  const userIdentifier: AcceptedIdentifiers = req.body[userMainIdentifier];

  if (!code) {
    next(invalidToken);
    return;
  }

  const dbToken = await TokenService.getByAttribute(
    userMainIdentifier,
    userIdentifier,
    notFoundToken
  );
  if (!dbToken || dbToken === true) return;

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

export default superToken;
