import { z } from "zod";

// “Web repo” expects this shape.
const webSchema = z.object({
  flags: z.array(z.object({ key: z.string(), enabled: z.boolean() }))
});

// “API repo” shipped a breaking change: renamed `enabled` -> `isEnabled`.
const apiResponse = {
  flags: [{ key: "checkout_v2", isEnabled: true }]
};

const parsed = webSchema.safeParse(apiResponse);
if (!parsed.success) {
  process.stdout.write("Contract drift detected:\n");
  process.stdout.write(`${parsed.error}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`ok: ${JSON.stringify(parsed.data)}\n`);
}

