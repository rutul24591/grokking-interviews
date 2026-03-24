# Server-Side Rendering for SEO — Example 3

Run:
```bash
pnpm install
pnpm dev
```

Open:
- `http://localhost:3000`
- `http://localhost:3000/blog/ssg-isr-hybrid`
- `http://localhost:3000/account`

Optional (on-demand ISR):
```bash
curl -X POST http://localhost:3000/api/revalidate -H 'content-type: application/json' -d '{"token":"dev","slug":"ssg-isr-hybrid"}'
```

