import { NextFunction, Response } from "express";
import { Model } from "mongoose";
import { IS_TOKEN_REQUIRED, MAIN_IDENTIFIER } from "../../config/database";
import Token from "../../modules/signToken/SignToken.model";
import User from "../../modules/user/User.model";
import ServeDatabase from "../services/ServeDatabase/ServeDatabase";
import CustomRequest from "../types/CustomRequest";
import { FindOptions } from "../types/requestOptions";
import CodedError from "../utils/CodedError";
import requestStores from "../utils/requestStores";

const invalidRequest = (attribute: string) =>
  CodedError(
    "badRequest",
    "Invalid request"
  )(Error(`The attribute ${attribute} is not defined`));

const findItem =
  <T>(model: Model<T>, baseOptions: FindOptions<T>) =>
  (itemOptions?: FindOptions<T>) => {
    const options: FindOptions<T> = {
      attribute: MAIN_IDENTIFIER as keyof T,
      getValueFrom: "body",
      ...baseOptions,
      ...itemOptions,
    };

    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      if (options.skip) {
        next();
        return;
      }

      const ItemService = ServeDatabase<T>(model)(next);

      const value = req[options.getValueFrom || "body"][options.attribute];

      if (!value) {
        next(invalidRequest(options.attribute as string));
        return;
      }

      const item = await ItemService.getByAttribute(
        options.attribute,
        value,
        options.specialError
      );

      if (!item || item === true) return;

      if (options.storeAt) requestStores[options.storeAt](req, item[0]);

      next();
    };
  };

export const findUser = findItem(User, {
  storeAt: "user",
});

export const findSignToken = findItem(Token, {
  storeAt: "token",
  skip: !IS_TOKEN_REQUIRED,
});

export default findItem;
