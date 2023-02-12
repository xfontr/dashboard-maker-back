type PowerLevels = 1 | 2 | 3 | 4;

type Actions = Partial<{
  /** Allows to create tokens with roles which index match the number specified */
  createToken: PowerLevels;
}>;

export default Actions;
