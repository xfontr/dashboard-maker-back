import IToken from "../../database/types/IToken";
import IUser from "../../database/types/IUser";
import CustomRequest from "../../types/CustomRequest";
import Payload from "../../types/Payload";

const requestStores = {
  token: <T>(req: CustomRequest, item: T) => {
    req.token = item as IToken;
  },
  payload: <T>(req: CustomRequest, item: T) => {
    req.payload = item as Payload;
  },
  authority: <T>(req: CustomRequest, item: T) => {
    req.authority = item as IUser;
  },
  user: <T>(req: CustomRequest, item: T) => {
    req.user = item as IUser;
  },
};

export default requestStores;
