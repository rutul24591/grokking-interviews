import { z } from "zod";

const upstreamV1 = z.object({
  id: z.string(),
  full_name: z.string()
});

const upstreamV2 = z.object({
  userId: z.string(),
  name: z.object({ first: z.string(), last: z.string() })
});

function normalizeProfile(raw) {
  const v1 = upstreamV1.safeParse(raw);
  if (v1.success) {
    return { userId: v1.data.id, displayName: v1.data.full_name };
  }
  const v2 = upstreamV2.parse(raw);
  return { userId: v2.userId, displayName: `${v2.name.first} ${v2.name.last}` };
}

const samples = [
  { id: "u1", full_name: "Ada Lovelace" },
  { userId: "u2", name: { first: "Grace", last: "Hopper" } }
];

for (const s of samples) process.stdout.write(`${JSON.stringify(normalizeProfile(s))}\n`);

