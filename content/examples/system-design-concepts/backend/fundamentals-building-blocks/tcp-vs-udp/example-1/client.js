// Client sending messages over TCP and UDP.

const net = require("net");
const dgram = require("dgram");

function sendTcp(message) {
  return new Promise((resolve) => {
    const client = net.createConnection({ port: 4040 }, () => {
      client.write(message);
    });
    client.on("data", (data) => {
      console.log("TCP response", data.toString("utf8").trim());
      client.end();
      resolve();
    });
  });
}

function sendUdp(message) {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket("udp4");
    client.send(Buffer.from(message), 4041, "127.0.0.1", (err) => {
      if (err) return reject(err);
      console.log("UDP message sent");
      client.close();
      resolve();
    });
  });
}

async function run() {
  await sendTcp("hello-tcp\n");
  await sendUdp("hello-udp\n");
}

run().catch((error) => console.error(error));
