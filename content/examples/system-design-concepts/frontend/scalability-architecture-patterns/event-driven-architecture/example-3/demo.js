import { randomUUID } from "node:crypto";
import { z } from "zod";
import { normalizeUserCreated, userCreatedV1, userCreatedV2 } from "./schemas.js";

const eventStream = [
  { id: randomUUID(), ts: Date.now(), type: "user.created", v: 1, data: { userId: "u1", email: "ada@example.com" } },
  {
    id: randomUUID(),
    ts: Date.now(),
    type: "user.created",
    v: 2,
    data: { userId: "u2", email: "grace@example.com", displayName: "Grace" }
  }
];

const anyUserCreated = z.union([userCreatedV1, userCreatedV2]);

for (const raw of eventStream) {
  const parsed = anyUserCreated.parse(raw);
  const normalized = normalizeUserCreated(parsed);
  process.stdout.write(`normalized v${parsed.v} -> v${normalized.v} displayName=${normalized.data.displayName}\n`);
}

