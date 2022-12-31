import { USER_MAIN_IDENTIFIER } from "../../../config/database";
import Payload from "../../types/Payload";
import mockUser from "./mockUser";

const mockPayload: Payload = {
  [USER_MAIN_IDENTIFIER]: mockUser[USER_MAIN_IDENTIFIER],
  id: "id",
};

export default mockPayload;
