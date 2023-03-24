import * as dotenv from "dotenv";
import { createClient } from "redis";
import express from "express";
import http from "http";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import socketIO from "./sockets";
import routes from "./routes";

export default async function setup(configPath) {
  // configs
  configPath ? dotenv.config({ path: configPath }) : dotenv.config();
  const port = process.env.PORT || 3000;
  const app = express();
  const server = http.createServer(app);

  // redis
  const client = createClient({ url: process.env.REDIS_ADDRESS });
  client.connect();
  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("connect", () => {
    console.log("Connented to redis");
  });
  global.redisClient = client;

  // db
  mongoose.connect(process.env.MONGODB_URI);
  mongoose.Promise = global.Promise;
  mongoose.connection.on("connected", () => {
    console.log("Connected to mongoDB!");
  });

  // middlewares
  app.use(morgan("dev"));
  app.use(express.json({}));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // sockets
  const io = socketIO(server);

  // routes
  app.use("/api/v1", routes);

  // start server
  server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });

  // handle uncaught rejections
  process.on("unhandledRejection", (reason, _promise) => {
    console.log("Unhandled Rejection at:", reason);
  });

  // handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
    process.exit(1); //mandatory (as per the Node.js docs)
  });

  // for testing purpose
  return { server, io, mongoose, app };
}
