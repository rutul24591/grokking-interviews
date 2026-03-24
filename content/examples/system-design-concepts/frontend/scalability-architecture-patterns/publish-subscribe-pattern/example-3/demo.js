import { randomUUID } from "node:crypto";

function createRetryingBroker() {
  /** @type {Set<(msg:any)=>Promise<void>>} */
  const subs = new Set();

  function subscribe(handler) {
    subs.add(handler);
    return () => subs.delete(handler);
  }

  async function deliver(handler, msg) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await handler(msg);
        return { ok: true, attempt };
      } catch {
        await new Promise((r) => setTimeout(r, 30 * attempt));
      }
    }
    return { ok: false, attempt: 3 };
  }

  async function publish(payload) {
    const msg = { id: randomUUID(), ts: Date.now(), payload };
    const results = await Promise.all([...subs].map((h) => deliver(h, msg)));
    return { msg, results };
  }

  return { subscribe, publish };
}

function createDedupeConsumer(name) {
  const seen = new Set();
  return async (msg) => {
    if (seen.has(msg.id)) {
      process.stdout.write(`[${name}] DUPLICATE ignored id=${msg.id}\n`);
      return;
    }
    seen.add(msg.id);
    // Simulate flaky processing.
    if (Math.random() < 0.4) throw new Error("transient");
    process.stdout.write(`[${name}] processed id=${msg.id} payload=${JSON.stringify(msg.payload)}\n`);
  };
}

const broker = createRetryingBroker();
broker.subscribe(createDedupeConsumer("A"));
broker.subscribe(createDedupeConsumer("B"));

for (let i = 0; i < 5; i += 1) {
  const { msg, results } = await broker.publish({ seq: i });
  process.stdout.write(`publish id=${msg.id} results=${JSON.stringify(results)}\n`);
}

