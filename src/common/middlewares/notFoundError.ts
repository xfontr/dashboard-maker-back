import { Request, Response } from "express";
import ERROR_CODES from "../../config/errorCodes";

const notFoundError = (req: Request, res: Response) =>
  res.status(ERROR_CODES.error.notFound).json({ error: "Endpoint not found" });

export default notFoundError;
