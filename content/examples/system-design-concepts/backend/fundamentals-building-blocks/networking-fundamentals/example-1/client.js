// Sends packets through routing, NAT, and firewall checks.

const { forward } = require("./network");

const packets = [
  { srcIp: "10.0.5.25", dstIp: "8.8.8.8", payload: "dns" },
  { srcIp: "10.0.6.10", dstIp: "8.8.8.8", payload: "dns" },
  { srcIp: "10.0.6.10", dstIp: "10.0.1.20", payload: "internal" },
];

for (const packet of packets) {
  console.log(packet, "=>", forward(packet));
}
