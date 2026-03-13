// Simple serializer/deserializer implementations for comparison.

function jsonEncode(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8");
}

function jsonDecode(buffer) {
  return JSON.parse(buffer.toString("utf8"));
}

function binaryEncode(payload) {
  // Minimal binary encoding: fixed fields in a buffer.
  const nameBuffer = Buffer.from(payload.name, "utf8");
  const buffer = Buffer.alloc(4 + 4 + nameBuffer.length);
  buffer.writeUInt32BE(payload.id, 0);
  buffer.writeUInt32BE(nameBuffer.length, 4);
  nameBuffer.copy(buffer, 8);
  return buffer;
}

function binaryDecode(buffer) {
  const id = buffer.readUInt32BE(0);
  const nameLength = buffer.readUInt32BE(4);
  const name = buffer.slice(8, 8 + nameLength).toString("utf8");
  return { id, name };
}

module.exports = { jsonEncode, jsonDecode, binaryEncode, binaryDecode };
