type Entry = { idempotencyKey: string; payload: string };

class Log {
  private seen = new Set<string>();
  private entries: Entry[] = [];

  append(e: Entry) {
    if (this.seen.has(e.idempotencyKey)) return { appended: false };
    this.seen.add(e.idempotencyKey);
    this.entries.push(e);
    return { appended: true };
  }

  list() {
    return this.entries;
  }
}

const log = new Log();
log.append({ idempotencyKey: "k1", payload: "a" });
log.append({ idempotencyKey: "k1", payload: "a" }); // retry

console.log(JSON.stringify({ entries: log.list() }, null, 2));

