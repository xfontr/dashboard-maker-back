// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "./connectDatabase";
import Token from "./modules/signToken/SignToken.model";
import User from "./modules/user/User.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUrl = mongoServer.getUri();

  await connectDatabase(mongoUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
  await Token.deleteMany();
});
