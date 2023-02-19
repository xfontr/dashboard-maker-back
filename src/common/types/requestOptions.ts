import { ICustomError } from "../utils/CustomError";
import { IStores } from "./CustomRequest";

export type FindOptions<T> = Partial<{
  skip: boolean;
  /**
   * The request attribute that holds the value that will be used to find the
   * item
   */
  getValueFrom: keyof IStores | "cookies" | "body";
  attribute: keyof T;

  /** The database response will be stored at the request attribute specified */
  storeAt: keyof IStores;

  specialError: ICustomError;
}>;
