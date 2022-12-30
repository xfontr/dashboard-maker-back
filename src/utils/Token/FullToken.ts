import IUser from "../../database/types/IUser";
import { createToken } from "../../services/authentication/authentication";

export default ({ id, email }: IUser) => ({
  user: {
    token: createToken({
      id,
      email,
    }),
  },
});
