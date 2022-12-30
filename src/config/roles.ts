import Roles from "../types/Roles";

const roles: Roles = {
  highest: {
    name: "superAdmin",
    actions: {
      createToken: ["admin", "user"],
    },
  },

  high: {
    name: "admin",
    actions: {
      createToken: ["user"],
    },
  },

  medium: {
    name: "admin",
  },

  low: {
    name: "user",
  },
};

export default roles;
