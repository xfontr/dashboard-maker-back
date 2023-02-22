import { ActionName, ActionOptions, IAction } from "../authorization.types";
import Action from "../authorization.utils";

describe("Given a Action function", () => {
  describe("When called with an action name 'CREATE_TOKEN'", () => {
    describe("And called again with custom options", () => {
      test("Then it should return an action object with all the passed data", () => {
        const actionName: ActionName = "CREATE_TOKEN";
        const options: ActionOptions = {
          isAuthorized: true,
          affectsUsers: ["admin"],
        };

        const expectedAction: IAction<typeof actionName> = {
          [actionName]: options,
        };

        const result = Action(actionName)(options);

        expect(result).toStrictEqual(expectedAction);
      });
    });
  });
});
