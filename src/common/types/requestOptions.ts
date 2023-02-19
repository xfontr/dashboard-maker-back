import { ICustomError } from "../utils/CustomError";
import { IStores } from "./CustomRequest";

export type FindOptions<T = unknown> = Partial<{
  skip: boolean;
  /**
   * The request attribute that holds the value that will be used to find the
   * item
   */
  getValueFrom: keyof IStores | "cookies" | "body";
  attribute: keyof T;

  /**
   * The database response will be stored at the request attribute specified. If
   * the database returns nothing, will store the initial passed value
   */
  storeAt: keyof IStores;

  specialError: ICustomError;
}>;
