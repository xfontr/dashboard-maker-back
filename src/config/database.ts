import LogInData from "../types/LogInData";

/** Caution: avoid changing this variable, as it may break the database */
const userMainIdentifier: keyof Omit<LogInData, "password"> = "email";

export default userMainIdentifier;
