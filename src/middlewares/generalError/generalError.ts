import { NextFunction, Request, Response } from "express";
import setDebug from "../../services/setDebug/setDebug";
import CustomError from "../../utils/CustomError/CustomError";

const debug = setDebug("general-error");

const validationError = (
  { code, message, publicMessage }: ReturnType<typeof CustomError>,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  debug("error", message);

  res.status(code).json({ error: publicMessage });
};

export default validationError;
