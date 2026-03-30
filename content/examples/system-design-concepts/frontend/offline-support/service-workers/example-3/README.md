## Service Workers — Example 3: Multi-tab update coordination

### Run
```bash
pnpm i
pnpm build
pnpm start
```

### Try this
1. Open `http://localhost:3000` in two tabs.
2. Pick the leader tab (shown in the UI).
3. Change `public/sw.js` `VERSION` to simulate an update.
4. Click “Check for update” in both tabs: only the leader should activate “Activate (leader only)”.

