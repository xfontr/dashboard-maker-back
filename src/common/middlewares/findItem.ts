import { NextFunction, Response } from "express";
import { Model } from "mongoose";
import ServeDatabase from "../services/ServeDatabase/ServeDatabase";
import CustomRequest from "../types/CustomRequest";
import { FindOptions } from "../types/requestOptions";
import CodedError from "../utils/CodedError";
import { ICustomError } from "../utils/CustomError";
import requestStores from "../utils/requestStores";

/**
 * Middleware that finds an item matching the specified attribute, by using the
 * main identifier
 *
 * @param error This param sets the error that will be sent if something goes
 *   wrong while finding the object.
 *
 *   If the error passed is of conflict type {409} or not found {404}, it will
 *   throw an error if it finds the item (when conflict) or if it doesn't (when
 *   not found)
 * @param options Object that allows to skip this middleware if a condition is
 *   met, and to store the findings in the request header at the desired place
 */
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

    const value = req[options.getValueFrom || "body"][attribute];

    if (!value) {
      next(
        CodedError(
          "badRequest",
          "Invalid request"
        )(Error(`The attribute ${attribute as string} is not defined`))
      );
      return;
    }

    const item = await ItemService.getByAttribute(attribute, value, error);

    if (!item || item === true) {
      return;
    }

    if (options.storeAt) requestStores[options.storeAt](req, item[0]);

    next();
  };

export default findItem;
