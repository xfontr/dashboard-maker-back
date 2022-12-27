import chalk, { Chalk } from "chalk";
import AvaliableColors from "../../types/avaliableColors";

export const BaseColors = ({
  bgGreen,
  green,
  bgRed,
  red,
  blue,
  bgYellow,
}: Chalk) => ({
  highSuccess: bgGreen,
  success: green,
  highError: bgRed,
  error: red,
  information: bgYellow,
  misc: blue,
});

const importChalkAndBaseColors =
  (colorSetter: typeof BaseColors, chalkFunction: Chalk) =>
  (color: AvaliableColors, message: string): string =>
    colorSetter(chalkFunction)[color](message);

/**
 * Imports Chalk and sets only available colors, to control the consistency of
 * the API colors.
 *
 * @example
 *   setMessage("error", "Something went wrong");
 *
 * @param {Function} BaseColors Function that returns an object with all the
 *   available colors, each associated with the function that emits it
 * @param {Chalk} chalkFunction The function provided by Chalk or the library
 *   used
 * @returns {Function} Returns a function that will call chalk with the selected
 *   type of color
 */

export default importChalkAndBaseColors(BaseColors, chalk);