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

    const role: UserRoles | undefined = item?.role;

    if (role === "superAdmin") {
      next();
      return;
    }

    /**
     * The conditional operator here makes sure that the payload actually has a
     * role, to avoid uncaught errors. Do not remove.
     */
    const requestedAction =
      AUTHORIZED_ACTIONS[role] && AUTHORIZED_ACTIONS[role][actionName];

    if (!requestedAction || !requestedAction.isAuthorized) {
      next(authorizationErrors.invalidRole);
      return;
    }

    /**
     * Do not remove the "?" (not including the conditional one). If any of the
     * options were not set correctly, the conditional will return false and
     * avoid uncaught errors.
     */
    const affectsUsersCondition: boolean = requestedAction.affectsUsers
      ? !!requestedAction.affectsUsers?.includes(
          req[options?.affectsUser]?.role
        )
      : true;

    if (affectsUsersCondition) {
      next();
      return;
    }

    next(authorizationErrors.invalidRole);
  };

export default authorization;
