# Example 1 — SSG with a Build-Time Content Pipeline (Next.js + Node.js)

## What it shows
- Build-time content compilation: `content-src/posts/*.md` → `content/posts.json`.
- SSG pages generated from that snapshot via `generateStaticParams`.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

## Build it (SSG)
```bash
pnpm build
pnpm start
```

The `build` script runs the Node content compiler before `next build`.

