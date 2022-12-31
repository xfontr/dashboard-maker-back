import app from "./app";
import ENVIRONMENT from "./config/environment";
import startServer from "./server";
import setDebug from "./common/services/setDebug";
import connectDatabase from "./connectDatabase";

const debug = setDebug("index");

const { port, database } = ENVIRONMENT;

(async () => {
  try {
    debug("information", "Initializing...");

    startServer(app, port);
    await connectDatabase(database);

    debug("highSuccess", "Server up and running");
  } catch (error) {
    debug("highError", `Launch error: ${error.message}`);
    process.exit(1);
  }
})();
