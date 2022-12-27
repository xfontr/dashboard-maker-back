import AvaliableColors from "../../types/AvaliableColors";
import setMessage from "./setMessage";

const mockBgRed = jest.fn();

jest.mock("chalk", () => ({
  ...jest.requireActual("chalk"),
  red: (message: string) => mockBgRed(message),
}));

describe("Given a setMessage function", () => {
  describe("When called with a color message of 'error' and a message of 'Something went wrong'", () => {
    test("Then it should call chalk with the 'error' color and said message", () => {
      const typeOfMessage: AvaliableColors = "error";
      const message = "Something went wrong";

      setMessage(typeOfMessage, message);

      expect(mockBgRed).toHaveBeenCalledWith(message);
    });
  });
});
