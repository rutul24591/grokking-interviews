export type Level = "debug" | "info" | "warn" | "error";
export type LogRecord = {
  ts: string;
  level: Level;
  msg: string;
  requestId?: string;
  fields?: Record<string, unknown>;
};

const MAX = 1200;
let buf: LogRecord[] = [];

const SENSITIVE_KEYS = new Set(["password", "token", "authorization", "email"]);

function redact(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    // basic email/token scrubbing
    return value
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
      .replace(/(Bearer\\s+)[A-Za-z0-9._-]+/g, "$1[redacted-token]");
  }
  if (Array.isArray(value)) return value.map(redact);
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? "[redacted]" : redact(v);
    }
    return out;
  }
  return value;
}

export function log(level: Level, msg: string, ctx?: { requestId?: string; fields?: Record<string, unknown> }) {
  const rec: LogRecord = {
    ts: new Date().toISOString(),
    level,
    msg,
    requestId: ctx?.requestId,
    fields: ctx?.fields ? (redact(ctx.fields) as Record<string, unknown>) : undefined
  };
  buf = [rec, ...buf].slice(0, MAX);
  return rec;
}

export function query(requestId: string | null) {
  if (!requestId) return buf.slice(0, 50);
  return buf.filter((r) => r.requestId === requestId).slice(0, 200);
}

export function resetLogs() {
  buf = [];
}

