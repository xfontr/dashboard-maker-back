import IUser from "../../users.types";
import { createToken } from "../../../../common/services/authentication";

const FullToken = ({ id, email, role }: IUser) => ({
  user: {
    token: createToken({
      id,
      email,
      role,
    }),
  },
});

export default FullToken;
