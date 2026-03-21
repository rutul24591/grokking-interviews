/**
 * Flake containment patterns:
 * - seeded randomness (reproducible)
 * - deterministic time
 * - isolate retries to “known flaky” tests
 */

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function flakyOperation(rng: () => number) {
  // simulate a flaky network call that fails ~20% of the time
  return rng() > 0.2;
}

function run(seed: number, attempts: number) {
  const rng = mulberry32(seed);
  let ok = 0;
  for (let i = 0; i < attempts; i++) {
    if (flakyOperation(rng)) ok++;
  }
  return { seed, attempts, ok, fail: attempts - ok };
}

console.log(
  JSON.stringify(
    {
      run1: run(42, 20),
      run2_same_seed: run(42, 20),
      run3_different_seed: run(7, 20),
      guidance: [
        "If a test flakes, capture the seed so the failure is reproducible.",
        "Prefer fixing the underlying nondeterminism over adding blanket retries.",
        "If retries are necessary, bound them and separate them from the main suite.",
      ],
    },
    null,
    2,
  ),
);

