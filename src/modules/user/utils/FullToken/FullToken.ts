import IUser from "../../users.types";
import { createToken } from "../../../../common/services/authentication";

export default ({ id, email }: IUser) => ({
  user: {
    token: createToken({
      id,
      email,
    }),
  },
});
