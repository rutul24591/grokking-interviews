import { dequeue, fail } from "./queue.js";

async function process(message) {
  if (!message) return;
  try {
    if (Math.random() < 0.3) throw new Error("random failure");
    console.log("processed", message.id);
  } catch (err) {
    fail(message);
  }
}

setInterval(() => {
  process(dequeue());
}, 500);