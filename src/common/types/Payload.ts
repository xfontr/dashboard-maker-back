import { UserRoles } from "../../modules/user/users.types";

interface Payload {
  email: string;
  id: string;
  role: UserRoles;
}

export default Payload;
