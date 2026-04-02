import { z } from "zod";

const Msg = z.object({
  type: z.literal("metric"),
  name: z.string().min(1).max(40),
  value: z.number().finite()
});

const good = { type: "metric", name: "click", value: 1 };
const bad = { type: "metric", name: "click", value: "1", __proto__: { polluted: true } };

console.log(
  JSON.stringify(
    {
      goodValid: Msg.safeParse(good).success,
      badValid: Msg.safeParse(bad).success,
      note: "Always validate and never trust shapes from third-party contexts."
    },
    null,
    2,
  ),
);

