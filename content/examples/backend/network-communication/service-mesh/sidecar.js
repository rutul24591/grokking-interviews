import http from "http";
import fetch from "node-fetch";

const server = http.createServer(async (req, res) => {
  const upstream = "http://localhost:4902" + req.url;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 200);
  try {
    const out = await fetch(upstream, {
      headers: { "x-mesh-id": "svc-a" },
      signal: controller.signal,
    });
    const body = await out.text();
    res.writeHead(out.status, { "x-proxied-by": "sidecar" });
    res.end(body);
  } catch (err) {
    res.writeHead(504);
    res.end("timeout");
  } finally {
    clearTimeout(timer);
  }
});

server.listen(4901, () => console.log("sidecar on :4901"));