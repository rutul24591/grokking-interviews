import { chooseVariant } from "./bucket";

function histogram(params: { users: string[]; salt: string; canaryPct: number }) {
  let baseline = 0;
  let canary = 0;
  for (const u of params.users) {
    const v = chooseVariant({ userId: u, salt: params.salt, canaryPct: params.canaryPct });
    if (v === "canary") canary += 1;
    else baseline += 1;
  }
  return { baseline, canary, total: params.users.length, canaryPct: canary / params.users.length };
}

const users = Array.from({ length: 100_000 }, (_, i) => `user-${i}`);
const salt = "rollout-20260320";

const h1 = histogram({ users, salt, canaryPct: 1 });
const h5 = histogram({ users, salt, canaryPct: 5 });
const h25 = histogram({ users, salt, canaryPct: 25 });

// Stability check: same config yields same assignment for a few sampled users.
const sampleUsers = ["user-7", "user-42", "user-1337", "user-9999"];
const assignmentsA = Object.fromEntries(sampleUsers.map((u) => [u, chooseVariant({ userId: u, salt, canaryPct: 10 })]));
const assignmentsB = Object.fromEntries(sampleUsers.map((u) => [u, chooseVariant({ userId: u, salt, canaryPct: 10 })]));

console.log(
  JSON.stringify(
    {
      histograms: { "1%": h1, "5%": h5, "25%": h25 },
      stability: { assignmentsA, assignmentsB, stable: JSON.stringify(assignmentsA) === JSON.stringify(assignmentsB) },
      interpretation:
        "Deterministic bucketing gives sticky routing without storing per-user state. Changing the salt forces reshuffling (useful during rollouts).",
    },
    null,
    2,
  ),
);

