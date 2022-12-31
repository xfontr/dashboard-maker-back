import { NextFunction, Response } from "express";
import { userMainIdentifier } from "../../../config/database";
import { compareHash } from "../../../common/services/authentication";
import AcceptedIdentifiers from "../../../common/types/AcceptedIdentifiers";
import catchCodedError from "../../../common/utils/catchCodedError";
import getBearerToken from "../../../common/utils/getBearerToken";
import { MiddlewareOptions } from "../../../common/types/requestOptions";
import CustomRequest from "../../../common/types/CustomRequest";
import Errors from "../../../common/errors/Errors";

const checkToken =
  (options: MiddlewareOptions = {}) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (options.skip) {
      next();
      return;
    }

    const tryThis = catchCodedError(next);
    const code = getBearerToken(req.headers.authorization);

    const userIdentifier: AcceptedIdentifiers = req.body[userMainIdentifier];
    const dbToken = req.token;

    if (!dbToken.isCodeRequired) {
      next();
      return;
    }

    if (!code || dbToken[userMainIdentifier] !== userIdentifier) {
      next(Errors.users.invalidToken);
      return;
    }

    const isTokenCorrect = await tryThis(compareHash, [code, dbToken.code]);

    if (!isTokenCorrect) {
      next(Errors.users.invalidToken);
      return;
    }

    next();
  };

export default checkToken;