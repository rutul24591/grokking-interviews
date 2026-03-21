type Command = { id: string; type: "add_note"; payload: { text: string }; idempotencyKey: string };

class Outbox {
  private queue: Command[] = [];
  enqueue(cmd: Command) {
    this.queue.push(cmd);
  }
  drain() {
    const all = this.queue;
    this.queue = [];
    return all;
  }
  size() {
    return this.queue.length;
  }
}

const outbox = new Outbox();
outbox.enqueue({ id: "c1", type: "add_note", payload: { text: "offline write 1" }, idempotencyKey: "k1" });
outbox.enqueue({ id: "c2", type: "add_note", payload: { text: "offline write 2" }, idempotencyKey: "k2" });

const processed = new Set<string>();
async function sendToServer(cmd: Command) {
  // idempotency: server remembers keys and ignores duplicates
  if (processed.has(cmd.idempotencyKey)) return { ok: true, deduped: true };
  processed.add(cmd.idempotencyKey);
  return { ok: true, deduped: false };
}

const drained = outbox.drain();
const results = await Promise.all(drained.map((c) => sendToServer(c)));
const retryDuplicate = await sendToServer(drained[0]!);

console.log(JSON.stringify({ initialQueued: 2, afterDrain: outbox.size(), results, retryDuplicate }, null, 2));

