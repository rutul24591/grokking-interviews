import { jsonOk } from "@/lib/http";

export async function GET(req: Request) {
  return jsonOk({
    ok: true,
    received: {
      origin: req.headers.get("origin"),
      secFetchSite: req.headers.get("sec-fetch-site"),
      userAgent: req.headers.get("user-agent"),
    },
  });
}

