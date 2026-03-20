# Example 3 — SSG Edge Case: Draft/Preview Mode

## What it shows
- An SSG page that normally reads static content.
- When Draft Mode is enabled, the page renders draft content without requiring a rebuild.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

## Try it
- Normal mode: `http://localhost:3000/posts/hello-world`
- Enable draft mode: `http://localhost:3000/api/draft?secret=dev&slug=hello-world`
- Disable draft mode: `http://localhost:3000/api/draft/disable`

