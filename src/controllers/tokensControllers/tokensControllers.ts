import { NextFunction, Request, Response } from "express";
import codes from "../../config/codes";
import { userMainIdentifier } from "../../config/database";
import Token from "../../database/models/Token";
import IToken from "../../database/types/IToken";
import { createHash } from "../../services/authentication/authentication";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";

const ServeToken = ServeDatabase<IToken>(Token);

const { success } = codes;

const generateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const TokensService = ServeToken(next);
  const tryThis = catchCodedError(next);

  const token: IToken = req.body;

  const tokenValue = (await tryThis(
    createHash,
    [token.code],
    "internalServerError"
  )) as string;

  if (!tokenValue) return;

  const doesTokenExist = await TokensService.getByAttribute(
    userMainIdentifier,
    token[userMainIdentifier]
  );

  if (doesTokenExist) {
    await TokensService.deleteByAttribute(
      userMainIdentifier,
      token[userMainIdentifier]
    );
  }

  const newToken = await TokensService.create({ ...token, code: tokenValue });

  if (!newToken) return;

  res.status(success.created).json({ token: "Token created successfully" });
};

export default generateToken;
