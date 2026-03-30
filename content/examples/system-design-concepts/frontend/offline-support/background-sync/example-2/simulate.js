import { computeBackoffMs } from "./backoff.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function flakySend({ failRate }) {
  await sleep(60);
  if (Math.random() < failRate) throw new Error("network-failure");
  return { ok: true };
}

async function replayWithBackoff({ maxAttempts, failRate }) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const delay = attempt === 0 ? 0 : computeBackoffMs({ attempt, baseMs: 200, capMs: 5_000, jitter: 0.3 });
    if (delay) await sleep(delay);
    try {
      await flakySend({ failRate });
      return { ok: true, attempt, delayMs: delay };
    } catch (e) {
      if (attempt === maxAttempts - 1) return { ok: false, attempt, delayMs: delay, error: e.message };
    }
  }
  return { ok: false };
}

const out = await replayWithBackoff({ maxAttempts: 8, failRate: Number(process.env.FAIL_RATE || 0.5) });
// eslint-disable-next-line no-console
console.log(out);

