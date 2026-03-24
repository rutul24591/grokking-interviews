## Module Federation — Example 1: Webpack host + remote (runtime composition)

This example implements a minimal **Module Federation** setup:
- a **remote** app exposes a React component
- a **host** app loads that component at runtime via `remoteEntry.js`
- `react` and `react-dom` are configured as shared singletons

### Run

Terminal 1 (remote on `3002`):
```bash
cd remote
pnpm i
pnpm dev
```

Terminal 2 (host on `3001`):
```bash
cd host
pnpm i
pnpm dev
```

Open `http://localhost:3001`.

