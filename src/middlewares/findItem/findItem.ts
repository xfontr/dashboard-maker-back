import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import { ICustomError } from "../../utils/CustomError/CustomError";
import FindOptions from "./findItem.types";

const findItem =
  <T>(
    model: Model<T>,
    attribute: keyof T,
    error: ICustomError,
    options: FindOptions = {}
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (options.skip) {
      next();
      return;
    }

    const ItemService = ServeDatabase<T>(model)(next);
    const value = req.body[attribute];

    const item = await ItemService.getByAttribute(attribute, value, error);

    if (!item || item === true) {
      return;
    }

    if (options.store) req.body.item = item;
    next();
  };

export default findItem;
