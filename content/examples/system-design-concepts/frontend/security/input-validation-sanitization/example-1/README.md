## Input Validation & Sanitization — Example 1: Zod validation at the API boundary

This Next.js example demonstrates a production pattern:
- validate and normalize inputs in the API route (server-side)
- return structured errors (don’t rely on client validation)
- enforce length limits and basic normalization

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000` and submit the form with valid and invalid inputs.

