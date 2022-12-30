import { NextFunction, Response } from "express";
import { UserRoles } from "../../database/types/IUser";
import CustomRequest from "../../types/CustomRequest";

const roleFilter =
  (role: UserRoles) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      next(Error);
      return;
    }

    next();
  };

export default roleFilter;
