import AcceptedIdentifiers from "../common/types/AcceptedIdentifiers";

/** Caution: avoid changing this variable, as it may break the database */
export const USER_MAIN_IDENTIFIER: AcceptedIdentifiers = "email";

/**
 * As a safety measure, this should be set to true. Caution: changing this
 * variable once the app is up could lead to unexpected behavior
 */
export const IS_TOKEN_REQUIRED = true;
