# Asset Versioning & Cache Busting — Example 1

Run:
```bash
pnpm install
pnpm dev
```

What to look for:
- `scripts/generateAssetManifest.mjs` generates `public/assets-hashed/*` + `lib/generated/assets-manifest.json`.
- `next.config.ts` sets long-lived cache headers for `/assets-hashed/*`.
- `lib/assetUrl.ts` resolves logical names to hashed URLs (with safe fallbacks).

