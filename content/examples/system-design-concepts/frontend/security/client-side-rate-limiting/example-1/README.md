## Client-side Rate Limiting — Example 1: Token bucket in the browser (protect backend)

This Next.js example demonstrates client-side throttling:
- UI uses a **token bucket** to limit how fast it calls an API
- server still receives requests (and should still enforce server-side limits)

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000` and click “Spam API”.

