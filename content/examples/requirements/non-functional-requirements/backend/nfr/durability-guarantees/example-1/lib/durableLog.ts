import fs from "node:fs";
import path from "node:path";

export type Entry = { offset: number; payload: string; ts: string };
export type Mode = "memory" | "durable";

const DATA_DIR = path.join(process.cwd(), "data");
const WAL_PATH = path.join(DATA_DIR, "wal.jsonl");

class DurableLog {
  private entries: Entry[] = [];
  private nextOffset = 0;

  private ensureDir() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  append(payload: string, mode: Mode): Entry {
    const entry: Entry = { offset: this.nextOffset++, payload, ts: new Date().toISOString() };

    if (mode === "durable") {
      this.ensureDir();
      const line = JSON.stringify(entry) + "\n";
      const fd = fs.openSync(WAL_PATH, "a");
      try {
        fs.writeSync(fd, line);
        fs.fsyncSync(fd);
      } finally {
        fs.closeSync(fd);
      }
    }

    // Ack after durability condition, then update memory view.
    this.entries.push(entry);
    return entry;
  }

  crash() {
    // Simulate a process crash: lose memory but keep WAL file.
    this.entries = [];
    this.nextOffset = 0;
  }

  replay(): { reloaded: number } {
    this.ensureDir();
    if (!fs.existsSync(WAL_PATH)) return { reloaded: 0 };
    const lines = fs.readFileSync(WAL_PATH, "utf-8").split("\n").filter(Boolean);
    const parsed: Entry[] = lines.map((l) => JSON.parse(l));
    this.entries = parsed;
    this.nextOffset = parsed.length ? parsed[parsed.length - 1]!.offset + 1 : 0;
    return { reloaded: parsed.length };
  }

  state() {
    let walBytes = 0;
    try {
      walBytes = fs.existsSync(WAL_PATH) ? fs.statSync(WAL_PATH).size : 0;
    } catch {
      walBytes = 0;
    }
    return { inMemory: this.entries, walPath: WAL_PATH, walBytes };
  }
}

export const log = new DurableLog();

