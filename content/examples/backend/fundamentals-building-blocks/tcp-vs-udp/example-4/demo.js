// Simple window control simulation.

let windowSize = 2;
const packets = ["a","b","c","d"];
console.log("Send", packets.slice(0, windowSize));
windowSize = 1;
console.log("Backpressure", packets.slice(0, windowSize));
