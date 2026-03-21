type RumEvent = {
  page: string;
  name: string;
  tags?: Record<string, string>;
};

function fnv1a32(input: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function deterministicSample(key: string, sampleRate: number) {
  if (sampleRate >= 1) return true;
  if (sampleRate <= 0) return false;
  const bucket = (fnv1a32(key) % 10_000) / 10_000;
  return bucket < sampleRate;
}

function scrubUrl(url: string) {
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    return u.toString();
  } catch {
    return url.split("?")[0]?.split("#")[0] || url;
  }
}

function scrubTags(tags: Record<string, string> | undefined) {
  if (!tags) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tags)) {
    if (k.toLowerCase().includes("email")) continue;
    if (k.toLowerCase().includes("token")) continue;
    out[k] = v.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi, "[redacted-email]");
  }
  return out;
}

function sanitizeEvent(e: RumEvent): RumEvent {
  return { ...e, page: scrubUrl(e.page), tags: scrubTags(e.tags) };
}

function bytesUtf8(s: string) {
  return new TextEncoder().encode(s).length;
}

function enforceBudget(e: RumEvent, maxBytes: number) {
  const b = bytesUtf8(JSON.stringify(e));
  if (b > maxBytes) throw new Error(`event too large: ${b} bytes (budget ${maxBytes})`);
}

const sessionId = "s_" + Math.random().toString(16).slice(2);
const shouldSend = deterministicSample(sessionId, 0.25);

const raw: RumEvent = {
  page: "https://example.com/checkout?email=alice@example.com&token=secret",
  name: "error",
  tags: { email: "alice@example.com", message: "boom token=secret" },
};

const sanitized = sanitizeEvent(raw);
enforceBudget(sanitized, 1024);

console.log(
  JSON.stringify(
    {
      sessionId,
      shouldSend,
      raw,
      sanitized,
    },
    null,
    2,
  ),
);

