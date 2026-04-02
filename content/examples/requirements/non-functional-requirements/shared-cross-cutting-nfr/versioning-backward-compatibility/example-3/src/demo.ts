import { z } from "zod";

const V1 = z.object({ id: z.string(), name: z.string() });
const V2 = z.object({ id: z.string(), displayName: z.string(), name: z.string().optional(), locale: z.string().optional() });

const goldens = [
  { version: "v1", payload: { id: "u1", name: "Ada" } },
  { version: "v2", payload: { id: "u1", displayName: "Ada", name: "Ada", locale: "en" } },
  { version: "v2", payload: { id: "u1", displayName: "Grace" } }, // v2 optional fields
] as const;

for (const g of goldens) {
  if (g.version === "v1") V1.parse(g.payload);
  else V2.parse(g.payload);
}

console.log({ ok: true, checked: goldens.length });

