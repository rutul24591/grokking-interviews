const produced = [40, 50, 60, 30];
let buffered = 0;
const drainPerTick = 55;

for (const outgoing of produced) {
  buffered += outgoing;
  buffered = Math.max(0, buffered - drainPerTick);
  console.log(`tick -> buffered ${buffered} messages`);
}

console.log(buffered > 100 ? "apply backpressure" : "buffer within budget");
