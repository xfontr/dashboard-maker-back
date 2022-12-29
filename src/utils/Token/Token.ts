import IUser from "../../database/types/IUser";
import { createToken } from "../../services/authentication/authentication";

export default ({ id, name }: IUser) => ({
  user: {
    token: createToken({
      id,
      name,
    }),
  },
});
