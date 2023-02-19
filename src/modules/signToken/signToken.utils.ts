import ENVIRONMENT from "../../config/environment";
import { UserRoles } from "../user/users.types";
import setAllowedRoles from "../../common/utils/setAllowedRoles";

const isAuthorizedToRequest = (
  requestorRole: UserRoles,
  userRequestedRole: UserRoles,
  requestorEmail?: string
) =>
  requestorEmail === ENVIRONMENT.defaultPowerEmail ||
  setAllowedRoles(requestorRole).includes(userRequestedRole);

export default isAuthorizedToRequest;
