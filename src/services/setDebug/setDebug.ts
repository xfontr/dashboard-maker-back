import "../../loadEnvironment";
import DebugFunction, { Debug, Debugger } from "debug";
import environment from "../../config/environment";
import setMessage from "../setMessage/setMessage";
import AvaliableColors from "../../types/AvaliableColors";
import DebugWithColors from "../../types/DebugWithColors";

const importDebugAndSetBaseLocation = (
  debug: Debug,
  baseLocation: string,
  callback: Function
): Debug => callback(debug, baseLocation);

const baseSetDebug =
  (debug: Debug, baseLocation: string) =>
  (currentLocation: string): Debugger =>
    debug(`${baseLocation.slice(0, -2)}:${currentLocation}`);

export const setDebugWithoutColors = importDebugAndSetBaseLocation(
  DebugFunction,
  environment.debug,
  baseSetDebug
);

export default (currentLocation: string): DebugWithColors =>
  (color: AvaliableColors, message: string): void =>
    setDebugWithoutColors(currentLocation)(setMessage(color, message));
