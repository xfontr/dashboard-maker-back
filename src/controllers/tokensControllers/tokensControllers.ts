import { NextFunction, Request, Response } from "express";
import codes from "../../config/codes";
import { userMainIdentifier } from "../../config/database";
import { ServeToken } from "../../database/servedModels";
import IToken from "../../database/types/IToken";
import { createHash } from "../../services/authentication/authentication";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";

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
