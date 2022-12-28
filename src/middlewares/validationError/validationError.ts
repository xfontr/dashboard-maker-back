import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import codes from "../../config/codes";
import setDebug from "../../services/setDebug/setDebug";

const debug = setDebug("validation-error");

const validationError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    debug("highError", `Validaton error: ${error.message}`);
    error.details.body.forEach(({ message }) => debug("error", message));
    res.status(codes.error.badRequest).json({ error: "Bad Request" });
    return;
  }

  next(error);
};

export default validationError;
