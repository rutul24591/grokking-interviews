function redact(message: string) {
  return message.replaceAll(/(token|apikey|password)=([^\\s]+)/gi, "$1=REDACTED");
}

function handleError(err: unknown, requestId: string) {
  const msg = err instanceof Error ? err.message : String(err);
  const safe = redact(msg);
  return { error: "internal", requestId, safeMessage: safe };
}

const requestId = "req_" + Math.random().toString(16).slice(2);
const out = handleError(new Error("upstream failed token=abc123"), requestId);
console.log(JSON.stringify(out, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

