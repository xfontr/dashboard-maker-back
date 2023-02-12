import { MAIN_IDENTIFIER } from "../../../config/database";
import Payload from "../../types/Payload";
import mockUser from "./mockUser";

const mockPayload: Payload = {
  [MAIN_IDENTIFIER]: mockUser[MAIN_IDENTIFIER],
  id: "id",
  role: mockUser.role,
};

export default mockPayload;
