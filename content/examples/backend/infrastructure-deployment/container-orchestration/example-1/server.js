/**
 * File: server.js
 * What it does: Minimal Node HTTP server exposing a topic simulation and a tiny UI.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const {{ runSimulation }} = require('./simulate');
const scenario = require('./scenario');

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

  if (req.url.startsWith('/api/run')) {{
    const url = new URL(req.url, 'http://localhost');
    const input = url.searchParams.get('input') || 'alpha';
    const result = await runSimulation(input, scenario);
    return send(res, 200, result);
  }}

  if (req.url.startsWith('/api/scenario')) {{
    return send(res, 200, {{ scenario }});
  }}

  res.writeHead(404, {{ 'Content-Type': 'text/plain' }});
  res.end('Not found');
}});

const port = process.env.PORT || 3000;
server.listen(port, () => {{
  console.log(`Server running on http://localhost:${{port}}`);
}});
