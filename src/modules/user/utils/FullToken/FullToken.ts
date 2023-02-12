import IUser from "../../users.types";
import { createToken } from "../../../../common/services/authentication";

export default ({ id, email, role }: IUser) => ({
  user: {
    token: createToken({
      id,
      email,
      role,
    }),
  },
});
