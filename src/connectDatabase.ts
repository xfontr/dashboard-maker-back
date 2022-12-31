import Database from "./common/services/Database";

export default async (credentials: string) => {
  Database.setStrictQuery();
  await Database.connect(credentials);
  Database.transformDocuments();
};
