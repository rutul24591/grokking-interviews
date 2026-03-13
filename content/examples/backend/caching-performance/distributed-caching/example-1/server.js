/**
 * File: server.js
 * What it does: Minimal Node HTTP server that exposes cache behavior and a tiny UI.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const Cache = require('./cache');
const {{ fetchData }} = require('./data');
const scenario = require('./scenario');

const cache = new Cache({{
  maxEntries: scenario.knobs.maxEntries,
  ttlMs: scenario.knobs.ttlMs,
}});

function send(res, status, body, headers = {{}}) {{
  res.writeHead(status, {{ 'Content-Type': 'application/json', ...headers }});
  res.end(JSON.stringify(body, null, 2));
}}

function serveFile(res, filePath, type) {{
  const data = fs.readFileSync(filePath);
  res.writeHead(200, {{ 'Content-Type': type }});
  res.end(data);
}}

const server = http.createServer(async (req, res) => {{
  if (req.url === '/' || req.url === '/index.html') {{
    return serveFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
  }}
  if (req.url === '/app.js') {{
    return serveFile(res, path.join(__dirname, 'public', 'app.js'), 'application/javascript');
  }}
  if (req.url === '/styles.css') {{
    return serveFile(res, path.join(__dirname, 'public', 'styles.css'), 'text/css');
  }}

  if (req.url.startsWith('/api/data')) {{
    const url = new URL(req.url, 'http://localhost');
    const key = url.searchParams.get('key') || 'alpha';
    const cached = cache.get(key);
    if (cached) {{
      return send(res, 200, {{ source: 'cache', data: cached, stats: cache.stats(), scenario }});
    }}
    const data = await fetchData(key, scenario.knobs.simulateLatencyMs);
    cache.set(key, data);
    return send(res, 200, {{ source: 'origin', data, stats: cache.stats(), scenario }});
  }}

  if (req.url.startsWith('/api/invalidate')) {{
    const url = new URL(req.url, 'http://localhost');
    const key = url.searchParams.get('key') || 'alpha';
    cache.invalidate(key);
    return send(res, 200, {{ ok: true, key, stats: cache.stats() }});
  }}

  if (req.url.startsWith('/api/stats')) {{
    return send(res, 200, {{ stats: cache.stats(), scenario }});
  }}

  res.writeHead(404, {{ 'Content-Type': 'text/plain' }});
  res.end('Not found');
}});

const port = process.env.PORT || 3000;
server.listen(port, () => {{
  console.log(`Server running on http://localhost:${{port}}`);
}});
