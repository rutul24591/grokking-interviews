const SENSITIVE_KEYS = new Set(["authorization", "token", "password", "cookie", "set-cookie"]);

export function redact(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) out[k] = "[REDACTED]";
    else out[k] = v;
  }
  return out;
}

export function log(params: {
  level: "info" | "warn" | "error";
  msg: string;
  traceId?: string;
  requestId?: string;
  fields?: Record<string, unknown>;
}) {
  const entry = {
    ts: new Date().toISOString(),
    level: params.level,
    msg: params.msg,
    traceId: params.traceId,
    requestId: params.requestId,
    fields: params.fields ? redact(params.fields) : undefined,
  };
  console.log(JSON.stringify(entry));
}

