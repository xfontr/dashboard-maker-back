import { Request, Response } from "express";
import codes from "../../config/codes";

const notFoundError = (req: Request, res: Response) =>
  res.status(codes.error.notFound).json({ error: "Endpoint not found" });

export default notFoundError;
