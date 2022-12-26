import { Express } from "express";
import { Server } from "http";
import { setDebug } from "../services/setDebug/setDebug";

const debug = setDebug("start-server");

const messages = {
  openPort: (port: number) => debug("highSuccess", `Listening at port ${port}`),
  listenError: (error: Error) =>
    debug("highError", `Error connecting to the server: ${error}`),
};

const PortListener = (app: Express) => ({
  openPort: (port: number): Server =>
    app.listen(port, () => messages.openPort(port)),
});

const ErrorHandler = () => ({
  listenErrors: (server: Server) => server.on("error", messages.listenError),
});

const ServerHanlder = (app: Express) => ({
  ...PortListener(app),
  ...ErrorHandler(),
});

export default (app: Express, port: number): void => {
  const { listenErrors, openPort } = ServerHanlder(app);
  listenErrors(openPort(port));
};
