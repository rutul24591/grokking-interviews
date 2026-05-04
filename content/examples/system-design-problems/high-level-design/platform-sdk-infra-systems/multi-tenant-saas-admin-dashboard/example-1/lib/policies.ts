function buildRequestKey(input) {
  return JSON.stringify(input);
}

function jitterBackoffMs(attempt, baseMs, maxMs) {
  const exp = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.random() * exp * 0.2;
  return Math.floor(exp + jitter);
}

function applyRetryPolicy({ attempt, baseMs, maxMs }) {
  return { delayMs: jitterBackoffMs(attempt, baseMs, maxMs) };
}

module.exports = { buildRequestKey, applyRetryPolicy };
