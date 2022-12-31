import AcceptedIdentifiers from "../types/AcceptedIdentifiers";

/** Caution: avoid changing this variable, as it may break the database */
export const userMainIdentifier: AcceptedIdentifiers = "email";

/**
 * As a safety measure, this should be set to true. Caution: changing this
 * variable once the app is up could lead to unexpected behavior
 */
export const isTokenRequired = true;
