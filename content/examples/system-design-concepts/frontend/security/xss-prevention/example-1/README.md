## XSS Prevention — Example 1: Safe Markdown rendering (React + sanitize)

This Next.js example demonstrates a production pattern:
- treat user-generated content as **Markdown**
- render via `react-markdown`
- enforce an allowlist with `rehype-sanitize`

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000` and try pasting common XSS payloads into the editor.

