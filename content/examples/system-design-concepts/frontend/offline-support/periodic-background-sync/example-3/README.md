## Periodic Background Sync — Example 3: Conditional refresh with `ETag`

### Run
```bash
pnpm i
pnpm build
pnpm start
```

Open `http://localhost:3000`.

### What to try
- Click `Refresh feed` twice and observe the second request return `304`.
- Click `Simulate new version` to force a changed payload and a new `ETag`.

