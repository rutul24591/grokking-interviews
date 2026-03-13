// Packet building helpers to simulate encapsulation.

function wrap(layer, payload) {
  return {
    layer,
    payload,
  };
}

function describe(packet, depth = 0) {
  const indent = "  ".repeat(depth);
  console.log(`${indent}${packet.layer}`);
  if (packet.payload && typeof packet.payload === "object" && packet.payload.layer) {
    describe(packet.payload, depth + 1);
  } else {
    console.log(`${indent}  data:`, packet.payload);
  }
}

module.exports = { wrap, describe };
