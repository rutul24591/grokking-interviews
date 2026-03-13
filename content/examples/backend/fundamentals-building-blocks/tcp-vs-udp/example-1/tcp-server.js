// TCP server demonstrating connection-oriented communication.

const net = require("net");

const server = net.createServer((socket) => {
  console.log("TCP client connected", socket.remoteAddress, socket.remotePort);

  socket.on("data", (data) => {
    console.log("TCP received", data.toString("utf8").trim());
    socket.write(`echo:${data}`);
  });

  socket.on("end", () => {
    console.log("TCP client disconnected");
  });
});

server.listen(4040, () => {
  console.log("TCP server listening on port 4040");
});
