import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import { ICustomError } from "../../utils/CustomError/CustomError";

const findItem =
  <T>(model: Model<T>, attribute: keyof T, error: ICustomError) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ItemService = ServeDatabase<T>(model)(next);
    const value = req.body[attribute];

    const item = await ItemService.getByAttribute(attribute, value, error);

    if (!item || item === true) {
      return;
    }

    req.body.item = item;
    next();
  };

export default findItem;
