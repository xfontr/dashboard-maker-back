import databaseHandler from "./databaseHandler";

export default (
  (database: typeof databaseHandler) => async (credentials: string) => {
    database.setStrictQuery();
    await database.connect(credentials);
    database.transformDocuments();
  }
)(databaseHandler);
