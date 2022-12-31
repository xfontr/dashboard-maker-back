import { NextFunction, Request, Response } from "express";
import ERROR_CODES from "../../config/errorCodes";
import { USER_MAIN_IDENTIFIER } from "../../config/database";
import { createHash } from "../../common/services/authentication";
import catchCodedError from "../../common/utils/catchCodedError";
import { ServeToken } from "../../common/services/ServeDatabase";
import IToken from "./token.types";

const { success } = ERROR_CODES;

const generateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const TokensService = ServeToken(next);
  const tryThis = catchCodedError(next);

  const token: IToken = req.body;

  const tokenValue = await tryThis<string, string>(createHash, [token.code]);
  if (!tokenValue) return;

  const newToken = await TokensService.create(
    { ...token, code: tokenValue },
    { replace: true, mainIdentifier: USER_MAIN_IDENTIFIER }
  );

  if (!newToken) return;

  res.status(success.created).json({ token: "Token created successfully" });
};

export default generateToken;
