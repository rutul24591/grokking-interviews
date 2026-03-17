// Benchmark payload sizes for different formats.

const { jsonEncode, binaryEncode } = require("./formats");

function sizeReport(payload) {
  const json = jsonEncode(payload);
  const binary = binaryEncode(payload);
  return {
    jsonBytes: json.length,
    binaryBytes: binary.length,
  };
}

module.exports = { sizeReport };
