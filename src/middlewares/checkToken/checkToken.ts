import { NextFunction, Request, Response } from "express";
import { userMainIdentifier } from "../../config/database";
import IToken from "../../database/types/IToken";
import { invalidToken } from "../../server/routers/usersRouter/usersRouter.errors";
import { compareHash } from "../../services/authentication/authentication";
import AcceptedIdentifiers from "../../types/AcceptedIdentifiers";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import getBearerToken from "../../utils/getBearerToken/getBearerToken";
import MiddlewareOptions from "../Types/MiddlewareOptions";

const checkToken =
  (options: MiddlewareOptions = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (options.skip) {
      next();
      return;
    }

    const tryThis = catchCodedError(next);
    const code = getBearerToken(req.headers.authorization);

    const userIdentifier: AcceptedIdentifiers = req.body[userMainIdentifier];
    const dbToken: IToken = req.body.item[0];

    if (!dbToken.isCodeRequired) {
      next();
      return;
    }

    if (!code || dbToken[userMainIdentifier] !== userIdentifier) {
      next(invalidToken);
      return;
    }

    const isTokenCorrect = await tryThis(compareHash, [code, dbToken.code]);

    if (!isTokenCorrect) {
      next(invalidToken);
      return;
    }

    next();
  };

export default checkToken;
