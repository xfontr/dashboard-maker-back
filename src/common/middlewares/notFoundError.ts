import { Request, Response } from "express";
import HTTP_CODES from "../../config/errorCodes";

const notFoundError = (req: Request, res: Response) =>
  res.status(HTTP_CODES.error.notFound).json({ error: "Endpoint not found" });

export default notFoundError;
