import { MAIN_IDENTIFIER } from "./database";

const ENDPOINTS = {
  users: {
    router: "/users",
    root: "/",
    userData: `/:user-${MAIN_IDENTIFIER}`,
    logIn: "/log-in",
    logOut: "/log-out",
    refresh: "/refresh",
  },
  signTokens: {
    router: "/tokens",
    root: "/",
    verify: "/verify",
  },
};

export default ENDPOINTS;
