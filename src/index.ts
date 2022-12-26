import environment from "./config/environment";
import connectDatabase from "./database";
import app from "./server";
import startServer from "./server/startServer";
import { setDebug } from "./services/setDebug/setDebug";

const debug = setDebug("index");

const { port, database } = environment;

(async () => {
  try {
    debug("information", "Initializing the API");
    startServer(app, port);
    await connectDatabase(database);
    debug("highSuccess", "API launched successfully");
  } catch (error) {
    debug("highError", `Launch error: ${error.message}`);
    process.exit(1);
  }
})();
