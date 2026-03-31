function chooseProtocol({ udpBlocked, packetLoss, connectionWarm }) {
  if (udpBlocked) return "fallback to HTTP/2";
  if (packetLoss > 0.03 && !connectionWarm) return "prefer HTTP/3";
  if (connectionWarm) return "HTTP/2 is acceptable";
  return "prefer HTTP/3";
}

for (const scenario of [
  { name: "mobile lossy network", udpBlocked: false, packetLoss: 0.08, connectionWarm: false },
  { name: "enterprise firewall", udpBlocked: true, packetLoss: 0.01, connectionWarm: false },
  { name: "warm CDN connection", udpBlocked: false, packetLoss: 0.01, connectionWarm: true }
]) {
  console.log(`${scenario.name} -> ${chooseProtocol(scenario)}`);
}
