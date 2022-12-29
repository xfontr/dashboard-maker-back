import { NextFunction, Request, Response } from "express";
import codes from "../../config/codes";
import { userMainIdentifier } from "../../config/database";
import Token from "../../database/models/Token";
import User from "../../database/models/User";
import IToken from "../../database/types/IToken";
import IUser from "../../database/types/IUser";
import { createHash } from "../../services/authentication/authentication";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import catchCodedError from "../../utils/catchCodedError/catchCodedError";
import CodedError from "../../utils/CodedError/CodedError";

const ServeToken = ServeDatabase<IToken>(Token);
const ServeUser = ServeDatabase<IUser>(User);

const invalidToken = CodedError(
  "conflict",
  "The requested token can't be authorized"
);

const { success } = codes;

const generateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const TokensService = ServeToken(next);
  const UsersService = ServeUser(next);
  const tryThis = catchCodedError(next);

  const token: IToken = req.body;

  const doesUserExist = await UsersService.getByAttribute(
    userMainIdentifier,
    token[userMainIdentifier],
    invalidToken(Error("The token's email is already registered"))
  );

  if (doesUserExist === true) return;

  const doesTokenExist = await TokensService.getByAttribute(
    userMainIdentifier,
    token[userMainIdentifier]
  );

  const tokenValue = (await tryThis(
    createHash,
    [token.token],
    "internalServerError"
  )) as string;

  if (!tokenValue) return;

  if (doesTokenExist) {
    await TokensService.deleteByAttribute(
      userMainIdentifier,
      token[userMainIdentifier]
    );
  }

  const newToken = await TokensService.create({ ...token, token: tokenValue });

  if (!newToken) return;

  res.status(success.created).json({ token: "Token created successfully" });
};

export default generateToken;
