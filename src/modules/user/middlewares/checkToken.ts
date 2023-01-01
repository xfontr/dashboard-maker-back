import { NextFunction, Response } from "express";
import { MAIN_IDENTIFIER } from "../../../config/database";
import { compareHash } from "../../../common/services/authentication";
import AcceptedIdentifiers from "../../../common/types/AcceptedIdentifiers";
import catchCodedError from "../../../common/utils/catchCodedError";
import getBearerToken from "../../../common/utils/getBearerToken";
import { MiddlewareOptions } from "../../../common/types/requestOptions";
import CustomRequest from "../../../common/types/CustomRequest";
import userErrors from "../users.errors";

const checkToken =
  (options: MiddlewareOptions = {}) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (options.skip) {
      next();
      return;
    }

    const tryThis = catchCodedError(next);
    const code = getBearerToken(req.headers.authorization);

    const userIdentifier: AcceptedIdentifiers = req.body[MAIN_IDENTIFIER];
    const dbToken = req.token;

    if (!dbToken.isCodeRequired) {
      next();
      return;
    }

    if (!code || dbToken[MAIN_IDENTIFIER] !== userIdentifier) {
      next(userErrors.invalidToken);
      return;
    }

    const isTokenCorrect = await tryThis(compareHash, [code, dbToken.code]);

    if (!isTokenCorrect) {
      next(userErrors.invalidToken);
      return;
    }

    next();
  };

export default checkToken;
