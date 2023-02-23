import { Request, Response } from "express";
import HTTP_CODES from "../../config/errorCodes";

const getHealth = (req: Request, res: Response) => {
  res
    .status(HTTP_CODES.success.ok)
    .json({ status: "Server is up and running" });
};

export default getHealth;
