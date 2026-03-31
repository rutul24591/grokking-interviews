import { WebSocketServer, WebSocket } from "ws";

const server = new WebSocketServer({ port: 4470 });

server.on("connection", (socket) => {
  socket.send("server: welcome");
  socket.on("message", (message) => {
    console.log(`server received -> ${String(message)}`);
    socket.close();
    server.close();
  });
});

const client = new WebSocket("ws://localhost:4470");
client.on("open", () => {
  console.log("client -> OPEN");
  client.send("client: hello");
});
client.on("message", (message) => {
  console.log(`client received -> ${String(message)}`);
});
client.on("close", () => {
  console.log("client -> CLOSED");
});
