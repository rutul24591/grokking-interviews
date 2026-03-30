function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function jitter(ms, spread = 0.3) {
  const delta = ms * spread;
  return ms + (Math.random() * 2 - 1) * delta;
}

function backoff(attempt) {
  const base = 200;
  const max = 5_000;
  const exp = Math.min(max, base * 2 ** attempt);
  return Math.round(jitter(exp));
}

function randomKey() {
  return `idem_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// Simulated server with idempotency memory.
const processed = new Map(); // idempotencyKey -> result
let serverVersion = 0;

async function sendToServer({ idempotencyKey, payload }) {
  const existing = processed.get(idempotencyKey);
  if (existing) return { replay: true, ...existing };

  // Random transient failure.
  if (Math.random() < 0.2) throw new Error("transient-500");
  await sleep(jitter(120));

  serverVersion += 1;
  const result = { ok: true, serverVersion, payloadHash: payload.hash };
  processed.set(idempotencyKey, result);
  return { replay: false, ...result };
}

async function processMutation(mutation, maxAttempts = 6) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await sendToServer(mutation);
      return { success: true, attempts: attempt + 1, res };
    } catch (e) {
      const wait = backoff(attempt);
      // eslint-disable-next-line no-console
      console.log(`- attempt=${attempt + 1} failed (${e instanceof Error ? e.message : String(e)}); retry in ${wait}ms`);
      await sleep(wait);
    }
  }
  return { success: false, attempts: maxAttempts, res: null };
}

const outbox = Array.from({ length: 10 }).map((_, i) => ({
  idempotencyKey: randomKey(),
  payload: { hash: `doc_${i}_v1` }
}));

// Introduce duplicates to prove idempotency.
outbox.splice(5, 0, { ...outbox[2] });
outbox.splice(9, 0, { ...outbox[7] });

// eslint-disable-next-line no-console
console.log(`Outbox size=${outbox.length} (includes duplicates to demonstrate idempotency)`);

let applied = 0;
for (const m of outbox) {
  // eslint-disable-next-line no-console
  console.log(`\nProcessing mutation key=${m.idempotencyKey} payload=${m.payload.hash}`);
  const r = await processMutation(m);
  if (r.success) {
    applied++;
    // eslint-disable-next-line no-console
    console.log(
      `✓ applied attempts=${r.attempts} serverVersion=${r.res.serverVersion} replay=${r.res.replay ? "yes" : "no"}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`✗ failed after ${r.attempts} attempts`);
  }
}

// eslint-disable-next-line no-console
console.log(`\nDone. Applied=${applied}/${outbox.length}. ServerVersion=${serverVersion}`);

