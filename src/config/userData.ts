import IUser from "../modules/user/users.types";

export type UserData = Partial<{
  min: number;
  max: number;
}>;

const userData: Partial<Record<keyof IUser, UserData>> = {
  name: {
    min: 3,
    max: 15,
  },

  email: {
    min: 10,
    max: 70,
  },
};

export default userData;
