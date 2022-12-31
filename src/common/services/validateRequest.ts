import { RequestHandler } from "express";
import { EvOptions, schema as Schema, validate } from "express-validation";

const defaultAbortEarly = { abortEarly: false };

export default (
  (validator: Function) =>
  (
    schema: Schema,
    options: EvOptions = {},
    joiRoot: object = defaultAbortEarly
  ): RequestHandler =>
    validator(schema, options, joiRoot)
)(validate);
