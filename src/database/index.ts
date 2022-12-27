import Connection from "./Connection";

export default (
  (database: typeof Connection) => async (credentials: string) => {
    database.setStrictQuery();
    await database.connect(credentials);
    database.transformDocuments();
  }
)(Connection);
