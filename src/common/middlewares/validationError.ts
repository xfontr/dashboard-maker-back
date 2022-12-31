import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import ERROR_CODES from "../../config/errorCodes";
import setDebug from "../services/setDebug";

const debug = setDebug("validation-error");

const validationError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    debug("highError", `Validation error: ${error.message}`);
    error.details.body.forEach(({ message }) => debug("error", message));
    res.status(ERROR_CODES.error.badRequest).json({ error: "Bad Request" });
    return;
  }

  next(error);
};

export default validationError;
