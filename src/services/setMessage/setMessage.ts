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

export default importChalkAndBaseColors(BaseColors, chalk);
