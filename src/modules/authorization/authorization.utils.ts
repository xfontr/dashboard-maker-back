import { ActionName, ActionOptions, IAction } from "./authorization.types";

const Action =
  <T extends ActionName>(actionName: T) =>
  (options: ActionOptions): IAction<T> =>
    ({
      [actionName]: options,
    } as IAction<T>);

export default Action;
