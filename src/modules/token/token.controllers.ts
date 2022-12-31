import { NextFunction, Request, Response } from "express";
import codes from "../../config/codes";
import { userMainIdentifier } from "../../config/database";
import { createHash } from "../../common/services/authentication";
import catchCodedError from "../../common/utils/catchCodedError";
import { ServeToken } from "../../common/services/ServeDatabase";
import IToken from "./token.types";

const { success } = codes;

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
    { replace: true, mainIdentifier: userMainIdentifier }
  );

  if (!newToken) return;

  res.status(success.created).json({ token: "Token created successfully" });
};

export default generateToken;
