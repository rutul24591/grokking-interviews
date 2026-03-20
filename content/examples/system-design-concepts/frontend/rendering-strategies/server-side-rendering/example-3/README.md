# Example 3 — SSR Edge Case: Hydration Mismatches

## What it shows
- A client component that renders time during SSR → hydration mismatch warning.
- A safer pattern: render stable HTML and update after mount.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` and toggle **Buggy / Fixed**. Check the console for hydration warnings in Buggy mode.

