import { io as Client } from "socket.io-client";
import setup from "../src/app";
import path from "path";
import request from "supertest";

describe("Test server", () => {
  let io, clientSocket, mongo, app;
  beforeAll(async () => {
    const serverInit = await setup(path.join(__dirname, ".env"));
    io = serverInit.io;
    mongo = serverInit.mongoose;
    app = serverInit.app;
    clientSocket = Client(serverInit.server, {
      transports: ["websocket"],
    });
    clientSocket.on("connect", () => {
      console.log("test client connected");
    });
    clientSocket.on("connect_error", (msg) => {
      console.log("test client error", msg);
    });
  });
  afterAll((done) => {
    io.close();
    clientSocket.close();
    global.redisClient.quit();
    mongo.connection.close();
    done();
  });
  test("should work (with ack)", async () => {
    clientSocket.emit("message", "somekey=value", (response) => {
      expect(response).toBe({});
    });
    const response = await request(app).get("/api/v1/key/foo").expect(200);
    console.log(response.body.value);
    expect(response?.body?.value).toBe("value");
  });
});
