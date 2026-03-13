import { WebSocketServer } from "ws";

const peers = new Set();

export function attachServer(wss) {
  wss.on("connection", (ws) => {
    peers.add(ws);
    ws.on("close", () => peers.delete(ws));
  });
}

export function broadcast(message) {
  peers.forEach((ws) => {
    if (ws.readyState === WebSocketServer.OPEN) {
      ws.send(message);
    }
  });
}