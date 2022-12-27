import "../loadEnvironment";

const { env } = process;

export default {
  debug: env.DEBUG ?? "*",
  port: (env.PORT as unknown as number) ?? 4_000,
  database: env.MONGO_DB,
  authSecret: env.AUTH_SECRET ?? "",
};
