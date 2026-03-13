// Simulated OSI/TCP-IP layers and their responsibilities.

const { wrap } = require("./packet");

function applicationLayer(payload) {
  return wrap("Application (HTTP)", `GET /health\n${payload}`);
}

function transportLayer(packet) {
  return wrap("Transport (TCP)", {
    srcPort: 51512,
    dstPort: 443,
    data: packet,
  });
}

function networkLayer(packet) {
  return wrap("Network (IP)", {
    srcIp: "10.0.1.5",
    dstIp: "203.0.113.10",
    data: packet,
  });
}

function dataLinkLayer(packet) {
  return wrap("Data Link (Ethernet)", {
    srcMac: "aa:bb:cc:dd:ee:ff",
    dstMac: "11:22:33:44:55:66",
    data: packet,
  });
}

function physicalLayer(packet) {
  return wrap("Physical (Wire)", packet);
}

module.exports = {
  applicationLayer,
  transportLayer,
  networkLayer,
  dataLinkLayer,
  physicalLayer,
};
