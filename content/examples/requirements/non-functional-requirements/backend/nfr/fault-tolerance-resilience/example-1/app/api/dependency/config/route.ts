import { dependency } from "@/lib/dependencySim";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z
  .object({
    mode: z.enum(["healthy", "always_fail", "fail_first_n"]),
    remaining: z.number().int().nonnegative().optional()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  if (parsed.data.mode === "healthy") dependency.setMode({ type: "healthy" });
  if (parsed.data.mode === "always_fail") dependency.setMode({ type: "always_fail" });
  if (parsed.data.mode === "fail_first_n") dependency.setMode({ type: "fail_first_n", remaining: parsed.data.remaining ?? 0 });

  return jsonOk({ ok: true, mode: dependency.mode });
}

