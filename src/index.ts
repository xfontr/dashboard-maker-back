import environment from "./config/environment";
import app from "./server";
import startServer from "./server/startServer";
import { setDebug } from "./services/setDebug/setDebug";

const debug = setDebug("index");

try {
  startServer(app, environment.port);
} catch (error) {
  debug("highError", `Launch error: ${error.message}`);
  process.exit(1);
}
