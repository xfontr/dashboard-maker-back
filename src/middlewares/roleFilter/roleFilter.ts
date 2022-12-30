import { NextFunction, Response } from "express";
import environment from "../../config/environment";
import Errors from "../../services/Errors/Errors";
import CustomRequest from "../../types/CustomRequest";
import setAllowedRoles from "../../utils/setAllowedRoles/setAllowedRoles";

const roleFilter = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.payload.email === environment.defaultPowerEmail) {
    req.authority = { ...req.payload, role: "superAdmin", password: "" };
  }

  if (!setAllowedRoles(req.authority.role).includes(req.body.role)) {
    next(Errors.tokens.unauthorizedToCreate);
    return;
  }

  next();
};

export default roleFilter;
