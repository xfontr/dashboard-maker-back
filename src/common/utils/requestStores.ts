import IToken from "../../modules/token/token.types";
import IUser from "../../modules/user/users.types";
import CustomRequest from "../types/CustomRequest";
import Payload from "../types/Payload";

const requestStores = {
  token: <T>(req: CustomRequest, item: T) => {
    req.token = item as IToken;
  },
  payload: <T>(req: CustomRequest, item: T) => {
    req.payload = item as Payload;
  },
  user: <T>(req: CustomRequest, item: T) => {
    req.user = item as IUser;
  },
};

export default requestStores;
