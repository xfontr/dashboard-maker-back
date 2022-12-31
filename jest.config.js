/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/app.ts",
    "!src/connectDatabase.ts",
    "!src/server.ts",
    "!src/common/services/Database.ts",
    "!src/config/*.ts",
    "!src/**/*.model.ts",
  ],
};
