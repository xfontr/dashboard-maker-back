import IOptions from "../modules/options/options.types";
import ISignToken from "../modules/signToken/signToken.types";
import IUser from "../modules/user/users.types";

interface AllTypes
  extends Partial<IUser>,
    Partial<ISignToken>,
    Partial<IOptions> {}

export type InputData = Partial<{
  min: number;
  max: number;
}>;

/**
 * Defines the length and other specifications of the data the user will be able
 * to input in its request.
 *
 * @example
 *   Set that the "name" property in each request will always have a minimum length of 3 and a maximum length of 15
 *   {name: {min: 3, max: 15}}
 */

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
