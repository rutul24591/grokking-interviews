## Factory Pattern — Example 1: Widget factory driven by server schema

This example shows a common production use of Factory in frontend systems:
- the server returns a **layout schema**
- the client uses a **factory** to map `type -> component`
- unknown/invalid data is rejected at the boundary (schema validation)

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

