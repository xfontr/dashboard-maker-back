import "../loadEnvironment";

export default {
  debug: process.env.DEBUG ?? "*",
  port: (process.env.PORT as unknown as number) ?? 4_000,
  database: process.env.MONGO_DB,
};
