import "../loadEnvironment";

const { env } = process;

const environment = {
  debug: env.DEBUG ?? "*",
  port: (env.PORT as unknown as number) ?? 4_000,
  database: env.MONGO_DB,
  authSecret: env.AUTH_SECRET ?? "",
};

export default environment;
