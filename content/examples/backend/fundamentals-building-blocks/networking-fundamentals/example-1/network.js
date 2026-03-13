// Simulates routing and NAT for packets crossing a boundary.

const { allow } = require("./firewall");

const routingTable = [
  { prefix: "10.0.0.0/8", nextHop: "internal" },
  { prefix: "0.0.0.0/0", nextHop: "internet" },
];

function parseIpv4(ip) {
  return ip.split(".").map(Number).reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
}

function cidrContains(cidr, ip) {
  const [base, bits] = cidr.split("/");
  const maskBits = Number(bits);
  const mask = maskBits === 0 ? 0 : 0xffffffff << (32 - maskBits);
  return (parseIpv4(base) & mask) === (parseIpv4(ip) & mask);
}

function route(destinationIp) {
  for (const entry of routingTable) {
    if (cidrContains(entry.prefix, destinationIp)) {
      return entry.nextHop;
    }
  }
  return "drop";
}

function natTranslate(packet) {
  return {
    ...packet,
    srcIp: "198.51.100.10",
    nat: true,
  };
}

function forward(packet) {
  if (!allow(packet.srcIp)) {
    return { action: "drop", reason: "firewall" };
  }

  const nextHop = route(packet.dstIp);
  if (nextHop === "internet") {
    return { action: "forward", packet: natTranslate(packet), nextHop };
  }

  if (nextHop === "internal") {
    return { action: "forward", packet, nextHop };
  }

  return { action: "drop", reason: "no-route" };
}

module.exports = { forward };
