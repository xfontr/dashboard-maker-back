import { NextFunction, Request, Response } from "express";
import { userMainIdentifier } from "../../config/database";
import Options from "../../database/models/Options";
import Token from "../../database/models/Token";
import IOptions from "../../database/types/IOptions";
import IToken from "../../database/types/IToken";
import { compareHash } from "../../services/authentication/authentication";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import AcceptedIdentifiers from "../../types/AcceptedIdentifiers";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import CodedError from "../../utils/CodedError/CodedError";
import getBearerToken from "../../utils/getBearerToken/getBearerToken";

const ServeOptions = ServeDatabase<IOptions>(Options);
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
  const OptionsService = ServeOptions(next);
  const TokenService = ServeToken(next);

  const tryThis = catchCodedError(next);
  const token = getBearerToken(req.headers.authorization);
  const userIdentifier: AcceptedIdentifiers = req.body[userMainIdentifier];

  const options = await OptionsService.getAll();
  if (!options) return;

  if (!options[0].registrationUsesToken) {
    next();
    return;
  }

  if (!token) {
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
    [token, dbToken[0].token],
    "internalServerError"
  );

  if (!isTokenCorrect) {
    next(invalidToken);
    return;
  }

  next();
};

export default superToken;
