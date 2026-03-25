import { randomUUID } from "node:crypto";

const store = new Map(); // token -> { family, used }

function issue(family) {
  const t = `r_${randomUUID()}`;
  store.set(t, { family, used: false });
  return t;
}

function rotate(token) {
  const rec = store.get(token);
  if (!rec) return { ok: false, error: "missing" };
  if (rec.used) return { ok: false, error: "replay_detected", family: rec.family };
  rec.used = true;
  const next = issue(rec.family);
  return { ok: true, next };
}

const family = `f_${randomUUID()}`;
const t1 = issue(family);
const r1 = rotate(t1);
process.stdout.write(`rotate1: ${JSON.stringify(r1)}\n`);

// Replay: attacker reuses the old token.
const replay = rotate(t1);
process.stdout.write(`replay: ${JSON.stringify(replay)}\n`);

