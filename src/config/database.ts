import AcceptedIdentifiers from "../common/types/AcceptedIdentifiers";

/**
 * Caution: avoid changing this variable once the database has been set, as it
 * may break it and cause unexpected behavior
 */
export const MAIN_IDENTIFIER: AcceptedIdentifiers = "email";

/**
 * As a safety measure, this should be set to true. Caution: changing this
 * variable once the app is up could lead to unexpected behavior
 */
export const IS_TOKEN_REQUIRED = true;

/**
 * TODO: Play with this values a bit to find possible errors. IMPORTANT: There's
 * a massive bu if following these steps: 1) Change refresh token to 1s, 2) Log
 * in, 3) Reload the page. API will break completely
 */

export const AUTH_TOKEN_EXPIRATION = {
  token: "800s",
  refreshToken: "1d",
};
