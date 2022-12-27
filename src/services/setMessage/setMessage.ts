import chalk, { Chalk } from "chalk";
import DebugColors from "../../types/DebugColors";

const BaseColors = (color: Chalk) => ({
  highSuccess: color.bgGreen,
  success: color.green,
  highError: color.bgRed,
  error: color.red,
  information: color.bgYellow,
  misc: color.blue,
});

export default (
  (colorSetter: typeof BaseColors, chalkFunction: Chalk) =>
  (color: DebugColors, message: string): string =>
    colorSetter(chalkFunction)[color](message)
)(BaseColors, chalk);
