/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server/*.ts",
    "!src/index.ts",
    "!src/config/*.ts",
    "!src/database/*.ts",
  ],
};
