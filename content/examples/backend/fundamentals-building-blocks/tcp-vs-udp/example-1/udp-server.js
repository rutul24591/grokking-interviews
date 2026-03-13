// UDP server demonstrating connectionless datagram handling.

const dgram = require("dgram");

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
  console.log("UDP received", msg.toString("utf8").trim(), "from", rinfo.address);
});

server.on("listening", () => {
  const address = server.address();
  console.log(`UDP server listening on ${address.port}`);
});

server.bind(4041);
