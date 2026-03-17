import { WebSocketServer } from "ws";
import { broadcast } from "./router.js";

const wss = new WebSocketServer({ port: 5100 });

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", () => (ws.isAlive = true));

  ws.on("message", (msg) => {
    broadcast(msg.toString());
  });

  ws.on("close", () => {
    // cleanup handled in router
  });
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 10000);