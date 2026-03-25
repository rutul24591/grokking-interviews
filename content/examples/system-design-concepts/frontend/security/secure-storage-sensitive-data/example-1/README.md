## Secure Storage of Sensitive Data — Example 1: HttpOnly cookie vs localStorage

This Next.js example demonstrates a core trade-off:
- localStorage is readable by JavaScript (XSS can steal it)
- HttpOnly cookies are not readable by JavaScript (reduces XSS impact)

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

