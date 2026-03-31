import { createServer } from "http";
import { WebSocketServer } from "ws";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    socket.send(`collaboration event ${count}`);
    if (count === 5) {
      clearInterval(interval);
      socket.close();
    }
  }, 400);

  socket.on("close", () => clearInterval(interval));
});

server.listen(Number(process.env.PORT || 4460), () => {
  console.log("WebSocket server on ws://localhost:4460");
});
