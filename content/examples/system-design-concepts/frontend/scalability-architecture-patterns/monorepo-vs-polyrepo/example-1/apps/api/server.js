import http from "node:http";
import { featureFlagsResponseSchema } from "@acme/contracts";

const PORT = Number(process.env.PORT ?? "4001");

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/flags") {
    const payload = {
      flags: [
        { key: "new_nav", enabled: true, variant: "A" },
        { key: "checkout_v2", enabled: false }
      ]
    };

    // Producer validates too (fail fast on bad data).
    const validated = featureFlagsResponseSchema.parse(payload);
    return json(res, 200, validated);
  }

  if (req.method === "GET" && url.pathname === "/health") return json(res, 200, { ok: true });

  return json(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

