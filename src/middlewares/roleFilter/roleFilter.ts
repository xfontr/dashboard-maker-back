import { NextFunction, Response } from "express";
import environment from "../../config/environment";
import roles from "../../config/roles";
import { UserRoles } from "../../database/types/IUser";
import Errors from "../../services/Errors/Errors";
import CustomRequest from "../../types/CustomRequest";

const roleFilter =
  (role: UserRoles) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.payload.email === environment.defaultPowerEmail) {
      req.authority = { ...req.payload, role: "superAdmin", password: "" };
    }

    if (roles[role].createToken.includes(req.authority.role)) {
      next(Errors.tokens.unauthorizedToCreate);
      return;
    }

    next();
  };

export default roleFilter;
