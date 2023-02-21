import { NextFunction, Response } from "express";
import AUTHORIZED_ACTIONS from "../../modules/authorization/authorization.actions";
import authorizationErrors from "../../modules/authorization/authorization.errors";
import {
  ActionName,
  PermissionOptions,
} from "../../modules/authorization/authorization.types";
import { UserRoles } from "../../modules/user/users.types";
import CustomRequest from "../types/CustomRequest";

const authorization =
  (actionName: ActionName, options?: PermissionOptions) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const item = req.payload;

    const role = item?.role as UserRoles | undefined;

    if (role === "superAdmin") {
      next();
      return;
    }

    const requestedAction = AUTHORIZED_ACTIONS[role][actionName];

    if (!requestedAction || !requestedAction.isAuthorized) {
      next(authorizationErrors.invalidRole);
      return;
    }

    const affectsUsersCondition = requestedAction.affectsUsers
      ? !!requestedAction.affectsUsers?.includes(req[options.affectsUser].role)
      : true;

    if (affectsUsersCondition) {
      next();
      return;
    }

    next(authorizationErrors.invalidRole);
  };

export default authorization;
