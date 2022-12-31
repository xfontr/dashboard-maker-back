import { userMainIdentifier } from "../../config/database";
import Payload from "../../types/Payload";
import mockUser from "./mockUser";

const mockPayload: Payload = {
  [userMainIdentifier]: mockUser[userMainIdentifier],
  id: "id",
};

export default mockPayload;
