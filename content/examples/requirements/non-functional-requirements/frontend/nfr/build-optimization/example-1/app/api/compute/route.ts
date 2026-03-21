import { jsonError, jsonOk } from "@/lib/http";

function lightCompute(n: number): number {
  return (n * 2654435761) >>> 0;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get("mode") || "light").toLowerCase();
  const n = Number(url.searchParams.get("n") || "2");
  if (!Number.isFinite(n) || n < 0 || n > 10) return jsonError(400, "bad_n");

  const started = Date.now();

  if (mode === "heavy") {
    const mod = await import("@/lib/heavy");
    const result = mod.heavyCompute(n);
    return jsonOk({
      ok: true,
      mode: "heavy",
      result,
      heavyLoadCount: mod.getHeavyLoadCount(),
      durationMs: Date.now() - started,
    });
  }

  const result = lightCompute(n);
  const count = (globalThis as unknown as { __heavy_load_count?: number }).__heavy_load_count ?? 0;
  return jsonOk({ ok: true, mode: "light", result, heavyLoadCount: count, durationMs: Date.now() - started });
}

