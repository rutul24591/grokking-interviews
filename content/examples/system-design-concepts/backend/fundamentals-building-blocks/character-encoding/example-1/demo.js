// Demonstrates UTF-8 byte lengths and mojibake.

const { utf8ByteLength, normalize, toBytes, fromBytes } = require("./encoding-utils");

const text = "café";
const composed = "é";
const decomposed = "e\u0301";

console.log("UTF-8 bytes", utf8ByteLength(text));
console.log("Composed === decomposed?", composed === decomposed);
console.log("Normalized equal?", normalize(composed) === normalize(decomposed));

const utf8Bytes = toBytes("こんにちは", "utf8");
console.log("UTF8 bytes", utf8Bytes);

const mojibake = fromBytes(utf8Bytes, "latin1");
console.log("Mojibake", mojibake);
