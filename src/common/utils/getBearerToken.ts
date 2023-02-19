const { initials, length } = {
  initials: "Bearer ",
  length: 7,
};

const getBearerToken = (token?: string): false | string =>
  !token || !token.startsWith(initials) ? false : token.slice(length);

export default getBearerToken;
