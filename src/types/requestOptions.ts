type Stores = "user" | "token";

export type MiddlewareOptions = Partial<{
  /** If set to true, this middleware will be skipped */
  skip: boolean;
}>;

export interface FindOptions extends MiddlewareOptions {
  /** The database response will be stored at the request attribute specified */
  storeAt?: Stores;
}
