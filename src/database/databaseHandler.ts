/* eslint-disable no-underscore-dangle */
import mongoose, { Mongoose } from "mongoose";
import setDebug from "../services/setDebug/setDebug";

const debug = setDebug("database-connect");

export default ((database: Mongoose) => {
  const SetStrictQuery = () => ({
    setStrictQuery: () => database.set("strictQuery", false),
  });

  const Connect = () => ({
    connect: (credentials: string) =>
      new Promise((resolve, reject) => {
        database.connect(credentials, (error: Error) => {
          if (error) {
            debug("error", `Error while connecting to the database: ${error}`);
            reject(error);
            return;
          }

          debug("success", "Connected to the database");
          resolve(true);
        });
      }),
  });

  const TransformDocuments = () => ({
    transformDocuments: () =>
      database.set("toJSON", {
        virtuals: true,
        transform: (_, ret) => {
          const newDocument = { ...ret };

          delete newDocument.__v;
          delete newDocument._id;

          return newDocument;
        },
      }),
  });

  return {
    ...SetStrictQuery(),
    ...Connect(),
    ...TransformDocuments(),
  };
})(mongoose);
