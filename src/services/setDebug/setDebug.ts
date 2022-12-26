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
  // eslint-disable-next-line arrow-body-style
  (currentLocation: string): Debugger => {
    return debug(`${baseLocation.slice(0, -2)}:${currentLocation}`);
  };

export const setDebugWithoutColors = importDebugAndSetBaseLocation(
  DebugFunction,
  environment.debug,
  baseSetDebug
);

/**
 *  Imports Debug and sets the base location from the environment.
 *
 *  @param {string} CurrentLocation Current file the user is at
 *
 *  @returns {Debug} Returns a Debug function that when called will know the base location and import Debug by default
 *
 *  @example
 *
 *  const debug = setDebug("index")
 *  debug("Server listening at port 3000")
 *
 */

export const setDebug = (currentLocation: string): CustomDebug => {
  const debug = setDebugWithoutColors(currentLocation);

  return (color: AvaliableColors, message: string): void =>
    debug(setMessage(color, message));
};
