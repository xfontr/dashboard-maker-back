import IOptions from "../modules/options/options.types";
import IToken from "../modules/token/token.types";
import IUser from "../modules/user/users.types";

interface AllTypes extends Partial<IUser>, Partial<IToken>, Partial<IOptions> {}

export type InputData = Partial<{
  min: number;
  max: number;
}>;

const INPUT_RULES: Partial<Record<keyof AllTypes, InputData>> = {
  name: {
    min: 3,
    max: 15,
  },

  email: {
    min: 10,
    max: 70,
  },
};

export default INPUT_RULES;
