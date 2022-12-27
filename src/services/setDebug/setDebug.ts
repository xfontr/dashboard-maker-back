import "../../loadEnvironment";
import DebugFunction, { Debug, Debugger } from "debug";
import environment from "../../config/environment";
import setMessage from "../setMessage/setMessage";
import AvaliableColors from "../../types/avaliableColors";
import CustomDebug from "../../types/customDebug";

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

export const setDebug = (currentLocation: string): CustomDebug => {
  const debug = setDebugWithoutColors(currentLocation);

  return (color: AvaliableColors, message: string): void =>
    debug(setMessage(color, message));
};
