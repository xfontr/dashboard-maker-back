import { NextFunction, Response } from "express";
import { UserRoles } from "../../database/types/IUser";
import CustomRequest from "../../types/CustomRequest";

const roleFilter =
  (role: UserRoles) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.authority.role !== role) {
      next(Error);
    }

    next();
  };

export default roleFilter;
