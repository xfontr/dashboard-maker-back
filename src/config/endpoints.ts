const ENDPOINTS = {
  health: {
    router: "/health",
    root: "/",
  },
  users: {
    router: "/users",
    root: "/",
    userData: `/profile`,
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
