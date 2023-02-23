const ENDPOINTS = {
  users: {
    router: "/users",
    root: "/",
    userData: `/logged-data`,
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
