import { IStores } from "../../common/types/CustomRequest";
import { UserRoles } from "../user/users.types";

export type ActionName = "CREATE_TOKEN" | "GET_ALL_USERS";

export type PermissionOptions = {
  affectsUser?: keyof IStores | "cookies" | "body";
};

export type ActionOptions = {
  isAuthorized: boolean;
  affectsUsers?: UserRoles[];
};

export type IAction<T extends ActionName> = {
  [K in T]: ActionOptions;
};
