declare global {
  // eslint-disable-next-line no-var
  var __heavy_load_count: number | undefined;
}

globalThis.__heavy_load_count = (globalThis.__heavy_load_count ?? 0) + 1;

export function getHeavyLoadCount(): number {
  return globalThis.__heavy_load_count ?? 0;
}

export function heavyCompute(n: number): number {
  // CPU-heavy loop to simulate a “big dependency / expensive feature”.
  // Keep deterministic so it can be used in agents/tests.
  let acc = 0;
  const loops = Math.max(1, Math.min(400_000, n * 40_000));
  for (let i = 0; i < loops; i++) acc = (acc + (i % 97)) % 1_000_003;
  return acc;
}

