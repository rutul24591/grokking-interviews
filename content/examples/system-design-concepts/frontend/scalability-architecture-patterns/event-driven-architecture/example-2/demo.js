import { createAsyncEventBus } from "./event-bus.js";

const bus = createAsyncEventBus({ capacity: 50, concurrency: 2 });

bus.on("realtime.update", async (payload) => {
  // Simulate a slow handler (e.g., analytics + DOM work).
  await new Promise((r) => setTimeout(r, 40));
  process.stdout.write(`handled update ${payload.seq}\n`);
});

let seq = 0;
const interval = setInterval(() => {
  seq += 1;
  const r = bus.emit("realtime.update", { seq });
  if (!r.accepted) process.stdout.write(`DROPPED seq=${seq} dropped=${r.dropped}\n`);
  if (seq >= 200) clearInterval(interval);
}, 5);

setInterval(() => {
  const s = bus.stats();
  process.stdout.write(`stats queued=${s.queued} running=${s.running} dropped=${s.dropped}\n`);
}, 250).unref();

