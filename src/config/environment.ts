import "../loadEnvironment";

const { env } = process;

const ENVIRONMENT = {
  debug: env.DEBUG ?? "*",
  port: (env.PORT as unknown as number) ?? 4_000,
  database: env.MONGO_DB,
  authSecret: env.AUTH_SECRET ?? "testingSecret",
  refreshAuthSecret: env.REFRESH_AUTH_SECRET ?? "testingSecret",
  defaultRegistrationToken: env.DEFAULT_REGISTRATION_TOKEN,
  defaultPowerToken: env.DEFAULT_POWER_TOKEN,
  defaultPowerEmail: env.DEFAULT_POWER_EMAIL,
  defaultPowerPassword: env.DEFAULT_POWER_PASSWORD,
};

export default ENVIRONMENT;
