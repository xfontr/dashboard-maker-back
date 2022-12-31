import { NextFunction, Response } from "express";
import ENVIRONMENT from "../../config/environment";
import tokenErrors from "../../modules/token/token.errors";
import CustomRequest from "../types/CustomRequest";
import setAllowedRoles from "../utils/setAllowedRoles";

const roleFilter = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.payload.email === ENVIRONMENT.defaultPowerEmail) {
    req.authority = { ...req.payload, role: "superAdmin", password: "" };
  }

  if (!setAllowedRoles(req.authority.role).includes(req.body.role)) {
    next(tokenErrors.unauthorizedToCreate);
    return;
  }

  next();
};

export default roleFilter;
