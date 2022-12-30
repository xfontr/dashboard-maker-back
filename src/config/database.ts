import AcceptedIdentifiers from "../types/AcceptedIdentifiers";

/** Caution: avoid changing this variable, as it may break the database */
export const userMainIdentifier: AcceptedIdentifiers = "email";

/**
 * Caution: there are almost no use cases where this will need to be set to
 * false. As a safety measure, this is highly recommendable as true
 *
 * TODO: This is currently not implemented, but its purpose is to remove all
 * token authentications by a simple switch
 */
export const isTokenRequired = true;
