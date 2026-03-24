# Micro-frontends — Example 1

This example runs **two processes**:
- `shell/` (Next.js) on `http://localhost:3000`
- `remote/` (Node micro-app) on `http://localhost:3001`

## Run remote
```bash
cd remote
pnpm install
pnpm start
```

## Run shell
```bash
cd shell
pnpm install
pnpm dev
```

Open:
- `http://localhost:3000`

