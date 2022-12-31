import LogInData from "./LogInData";

type AcceptedIdentifiers = keyof Omit<LogInData, "password">;

export default AcceptedIdentifiers;
