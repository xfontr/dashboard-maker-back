import environment from "../../config/environment";
import DebugColors from "../../types/DebugColors";
import setMessage from "../setMessage/setMessage";
import setDebug, { setDebugWithoutColors } from "./setDebug";

const mockDebugger = jest.fn();
const mockDebug = jest.fn().mockReturnValue(mockDebugger);

jest.mock("debug", () => (location: string) => mockDebug(location));

describe("Given a setDebugWithoutColors function", () => {
  describe("When called with a current location 'test'", () => {
    const currentLocation = "test";

    test("Then it should call debug with the environment debug base location and the passed text", () => {
      const slicedBaseLocation = `${environment.debug.slice(
        0,
        -2
      )}:${currentLocation}`;

      setDebugWithoutColors(currentLocation);

      expect(mockDebug).toHaveBeenCalledWith(slicedBaseLocation);
    });

    test("Then it should return a function that when called, should instantiate the Debugger with the passed text", () => {
      const text = "message";

      const returnedDebugger = setDebugWithoutColors(currentLocation);

      returnedDebugger(text);

      expect(mockDebugger).toHaveBeenCalledWith(text);
    });
  });
});

describe("Given a setDebug function", () => {
  describe("When caled with a current location 'test'", () => {
    const currentLocation = "test";

    test("Then it should return a function that sets a message with a color and a text", () => {
      const typeOfMessage: DebugColors = "error";
      const message = "Something went wrong";
      const slicedBaseLocation = `${environment.debug.slice(
        0,
        -2
      )}:${currentLocation}`;

      const debugWithSetMessage = setDebug(currentLocation);

      expect(mockDebug).toHaveBeenCalledWith(slicedBaseLocation);

      debugWithSetMessage(typeOfMessage, message);

      expect(mockDebugger).toHaveBeenCalledWith(
        setMessage(typeOfMessage, message)
      );
    });
  });
});
