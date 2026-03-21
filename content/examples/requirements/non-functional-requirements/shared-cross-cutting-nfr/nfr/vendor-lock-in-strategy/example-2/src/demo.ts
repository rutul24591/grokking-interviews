import { runObjectStoreContract } from "./contracts.js";
import { BrokenNoOverwriteStore, InMemoryStore } from "./stores.js";

async function main() {
  const results: Array<{ name: string; ok: boolean; error?: string }> = [];

  const candidates = [
    { name: "in-memory", store: new InMemoryStore(), expectOk: true },
    { name: "broken-no-overwrite", store: new BrokenNoOverwriteStore(), expectOk: false },
  ] as const;

  for (const c of candidates) {
    try {
      await runObjectStoreContract(c.store, c.name);
      results.push({ name: c.name, ok: true });
      if (!c.expectOk) throw new Error("expected contract to fail but it passed");
    } catch (e) {
      results.push({ name: c.name, ok: false, error: e instanceof Error ? e.message : String(e) });
      if (c.expectOk) throw e;
    }
  }

  console.log(JSON.stringify({ ok: true, results }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

