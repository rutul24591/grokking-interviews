## Subresource Integrity (SRI) — Example 1: Script integrity enforced by the browser

This example contains:
- `server/`: Node server that serves an HTML page with a `<script>` tag using `integrity="sha384-..."`.
- `web/`: Next UI that links to the server’s “good” and “bad hash” pages.

### Run

Terminal 1 (SRI server on `4555`):
```bash
cd server
pnpm i
pnpm dev
```

Terminal 2 (web):
```bash
cd web
pnpm i
pnpm dev
```

Open `http://localhost:3000` and click the “good” and “bad” links.

