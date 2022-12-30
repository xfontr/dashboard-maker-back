import { NextFunction, Response } from "express";
import { Model } from "mongoose";
import ServeDatabase from "../../services/ServeDatabase/ServeDatabase";
import CustomRequest from "../../types/CustomRequest";
import { FindOptions } from "../../types/requestOptions";
import { ICustomError } from "../../utils/CustomError/CustomError";
import requestStores from "../../utils/requestStores/requestStores";

const findItem =
  <T>(
    model: Model<T>,
    attribute: keyof T,
    error: ICustomError,
    options: FindOptions = {}
  ) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    if (options.storeAt) requestStores[options.storeAt](req, item[0]);

    next();
  };

export default findItem;
