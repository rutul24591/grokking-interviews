// Utilities for encoding inspection and normalization.

function utf8ByteLength(text) {
  return Buffer.byteLength(text, "utf8");
}

function normalize(text, form = "NFC") {
  return text.normalize(form);
}

function toBytes(text, encoding = "utf8") {
  return Buffer.from(text, encoding);
}

function fromBytes(bytes, encoding = "utf8") {
  return Buffer.from(bytes).toString(encoding);
}

module.exports = { utf8ByteLength, normalize, toBytes, fromBytes };
