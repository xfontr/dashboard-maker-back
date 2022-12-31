const { initials, length } = {
  initials: "Bearer ",
  length: 7,
};

export default (token?: string) => {
  if (!token || !token.startsWith(initials)) {
    return false;
  }

  return token.slice(length);
};
