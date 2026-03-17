// Runs serialization comparisons.

const { jsonEncode, jsonDecode, binaryEncode, binaryDecode } = require("./formats");
const { sizeReport } = require("./benchmark");

const payload = { id: 42, name: "interview-prep" };

console.log("Sizes", sizeReport(payload));
console.log("JSON decoded", jsonDecode(jsonEncode(payload)));
console.log("Binary decoded", binaryDecode(binaryEncode(payload)));
