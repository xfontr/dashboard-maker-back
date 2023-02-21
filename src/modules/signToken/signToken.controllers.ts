import { NextFunction, Response } from "express";
import HTTP_CODES from "../../config/errorCodes";
import { IS_TOKEN_REQUIRED, MAIN_IDENTIFIER } from "../../config/database";
import { createHash } from "../../common/services/authentication";
import catchCodedError from "../../common/utils/catchCodedError";
import { ServeToken } from "../../common/services/ServeDatabase";
import CustomRequest from "../../common/types/CustomRequest";
import signTokenErrors from "./signToken.errors";
import isSignTokenValid from "../../common/utils/isSignTokenValid";
import isAllowed from "../../common/utils/authorization";

const { success } = HTTP_CODES;

export const generateSignToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const TokensService = ServeToken(next);
  const tryThis = catchCodedError(next);

  // const requestorData = req.payload;

  // if (
  //   !isAllowed(requestorData.role, "CREATE_TOKEN", {
  //     affectsUser: req.token.role,
  //   })
  // ) {
  //   next(signTokenErrors.unauthorizedToCreate);
  //   return;
  // }

  const tokenValue = await tryThis<string, string>(createHash, [
    req.token.code,
  ]);
  if (!tokenValue) return;

  const newToken = await TokensService.create(
    { ...req.token, code: tokenValue },
    { replace: true, mainIdentifier: MAIN_IDENTIFIER }
  );

  if (!newToken) return;

  res.status(success.created).json({ token: "Token created successfully" });
};

export const verifySignToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const isTokenValid = await isSignTokenValid(req, next, !IS_TOKEN_REQUIRED);

  if (!isTokenValid) return;

  res.status(success.ok).json({ token: req.token });
};
