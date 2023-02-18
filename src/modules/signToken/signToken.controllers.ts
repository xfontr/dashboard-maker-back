import { NextFunction, Response } from "express";
import HTTP_CODES from "../../config/errorCodes";
import { MAIN_IDENTIFIER } from "../../config/database";
import { createHash } from "../../common/services/authentication";
import catchCodedError from "../../common/utils/catchCodedError";
import { ServeToken } from "../../common/services/ServeDatabase";
import ISignToken from "./signToken.types";
import CustomRequest from "../../common/types/CustomRequest";
import isAuthorizedToRequest from "./signToken.utils";
import tokenErrors from "./signToken.errors";

const { success } = HTTP_CODES;

export const generateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const TokensService = ServeToken(next);
  const tryThis = catchCodedError(next);

  const requestorData = req.payload;
  const token: ISignToken = req.body;

  if (
    !isAuthorizedToRequest(requestorData.role, token.role, requestorData.email)
  ) {
    next(tokenErrors.unauthorizedToCreate);
    return;
  }

  const tokenValue = await tryThis<string, string>(createHash, [token.code]);
  if (!tokenValue) return;

  const newToken = await TokensService.create(
    { ...token, code: tokenValue },
    { replace: true, mainIdentifier: MAIN_IDENTIFIER }
  );

  if (!newToken) return;

  res.status(success.created).json({ token: "Token created successfully" });
};

export const verifyToken = async (req: CustomRequest, res: Response) => {
  res.status(success.ok).json({ token: req.token });
};
