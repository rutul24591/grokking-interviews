import http from "node:http";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

function html() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Remote MFE - Profile</title>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: ui-sans-serif, system-ui; background: #0b1020; color: #e6e9f2; }
      .wrap { padding: 16px; }
      .card { border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
      .muted { color: #a7b0c3; font-size: 13px; }
      .btn { margin-top: 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(165,180,252,0.20); color: #e6e9f2; border-radius: 10px; padding: 8px 12px; font-weight: 700; cursor: pointer; }
      .btn:hover { background: rgba(165,180,252,0.28); }
      .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,0.08); margin-left: 6px; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1 style="margin: 0 0 6px 0; font-size: 18px;">Remote Profile Micro-frontend</h1>
        <p class="muted" style="margin: 0 0 12px 0;">
          This is served by a standalone Node server and embedded into the shell via an iframe.
          <span class="pill" id="theme-pill">theme: dark</span>
        </p>
        <p class="muted" style="margin: 0;">
          Messages are exchanged via <code>postMessage</code> with origin allowlisting and versioned schemas.
        </p>
        <button class="btn" id="btn">Emit event</button>
      </div>
    </div>

    <script type="module">
      const CONTRACT_VERSION = 1;
      const ALLOWED_PARENT_ORIGINS = new Set(["http://localhost:3000"]);
      const pill = document.getElementById("theme-pill");
      const btn = document.getElementById("btn");

      function post(type, payload = {}) {
        // In production: use a strict targetOrigin and include a nonce/handshake token.
        window.parent.postMessage({ v: CONTRACT_VERSION, type, payload }, "*");
      }

      function reportHeight() {
        const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        post("mfe:height", { height: h });
      }

      window.addEventListener("message", (e) => {
        if (!ALLOWED_PARENT_ORIGINS.has(e.origin)) return;
        const msg = e.data;
        if (!msg || typeof msg !== "object") return;
        if (msg.v !== CONTRACT_VERSION) return;

        if (msg.type === "shell:setTheme") {
          const theme = msg.payload?.theme === "light" ? "light" : "dark";
          pill.textContent = "theme: " + theme;
          document.body.style.background = theme === "light" ? "#f6f7fb" : "#0b1020";
          document.body.style.color = theme === "light" ? "#0b1020" : "#e6e9f2";
          reportHeight();
        }
      });

      btn.addEventListener("click", () => {
        post("mfe:event", { name: "profile.clicked", ts: new Date().toISOString() });
      });

      post("mfe:ready", { name: "profile", contractVersion: CONTRACT_VERSION });
      reportHeight();
      new ResizeObserver(reportHeight).observe(document.documentElement);
    </script>
  </body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (!req.url || req.url === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html());
    return;
  }
  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("not found");
});

server.listen(PORT, () => {
  console.log(`remote micro-app listening on http://localhost:${PORT}`);
});

