import { Server } from "socket.io";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";
import { MonkSchema } from "../models/monk";

export default function socketIO(server) {
  const io = new Server(server, {
    transports: ["websocket"],
    cors: {
      origin: "*",
    },
  });
  // pm2 socket.io cluster mode
  +process.env.isCluster && io.adapter(createAdapter() as any);
  +process.env.isCluster && setupWorker(io);

  io.on("connection", (socket) => {
    socket.on("message", onMessageHandler);
  });
  return io;
}

async function onMessageHandler(payload, callback) {
  if (payload) {
    const [key, value] = payload.split("=");
    try {
      // adds key, value pair to redis cache and mongodb
      const [redisDoc, mongoDoc] = await Promise.all([
        global.redisClient.set(key, value),
        new MonkSchema({ key, value }).save(),
      ]);
      if (redisDoc === "OK" && mongoDoc) {
        console.log(`Added successfully. Key: ${key}, Value: ${value}`);
        callback({ key, value, status: "OK" });
      } else if (redisDoc !== "OK" && mongoDoc) {
        console.warn(`Redis Cache Failed to add key: ${key}, Value: ${value}`);
        callback({ key, value, status: "FAILED" });
      } else if (redisDoc === "OK" && !mongoDoc) {
        console.warn(`Mongo DB Failed to add key: ${key}, Value: ${value}`);
        callback({ key, value, status: "FAILED" });
      } else {
        callback({ key, value, status: "ERROR" });
        throw new Error("Redis Cache and Mongo DB Failed to add key");
      }
    } catch (error) {
      console.error(error);
      callback({ key, value, status: "ERROR" });
    }
  }
}
