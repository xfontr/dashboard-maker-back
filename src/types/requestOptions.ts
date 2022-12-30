import requestStores from "../utils/requestStores/requestStores";

type Stores = keyof typeof requestStores;

export type MiddlewareOptions = Partial<{
  /** If set to true, this middleware will be skipped */
  skip: boolean;
}>;

export interface FindOptions extends MiddlewareOptions {
  /** The database response will be stored at the request attribute specified */
  storeAt?: Stores;

  /**
   * The request attribute that holds the value that will be used to find the
   * item
   */
  getValueFrom?: Stores | "body";
}
