let loadCount = 0;

async function loadHeavyModule() {
  loadCount++;
  return {
    heavyFn() {
      return 42;
    },
  };
}

async function run(featureEnabled: boolean) {
  if (!featureEnabled) return { ok: true, result: "skipped", loadCount };
  const mod = await loadHeavyModule();
  return { ok: true, result: mod.heavyFn(), loadCount };
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

const a = await run(false);
assert(a.loadCount === 0, "heavy module should not load when feature disabled");

const b = await run(true);
assert(b.loadCount === 1 && b.result === 42, "heavy module should load once when enabled");

const c = await run(true);
assert(c.loadCount === 2, "subsequent enabled runs load again (no module cache in this toy model)");

console.log(JSON.stringify({ ok: true }, null, 2));

