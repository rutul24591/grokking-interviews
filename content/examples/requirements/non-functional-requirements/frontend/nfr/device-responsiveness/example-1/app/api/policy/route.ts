import { jsonOk } from "@/lib/http";
import { computeLayoutPolicy } from "@/lib/policy";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const widthPx = Number(url.searchParams.get("width") || "375");
  const dpr = Number(url.searchParams.get("dpr") || "2");
  const reducedMotion = (url.searchParams.get("reducedMotion") || "false") === "true";

  return jsonOk({
    ok: true,
    policy: computeLayoutPolicy({
      widthPx: Number.isFinite(widthPx) ? widthPx : 375,
      dpr: Number.isFinite(dpr) ? dpr : 2,
      reducedMotion,
    }),
  });
}

