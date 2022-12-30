import MiddlewareOptions from "../Types/MiddlewareOptions";

interface FindOptions extends MiddlewareOptions {
  /**
   * If set to true, the database response will be stored at the body request,
   * as an item
   */
  store?: boolean;
}

export default FindOptions;
