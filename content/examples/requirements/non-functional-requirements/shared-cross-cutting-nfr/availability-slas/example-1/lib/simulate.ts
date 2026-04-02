import { clamp01, type Component } from "./availability";

export function simulateAvailability(params: {
  composition: "serial" | "parallel";
  components: Component[];
  trials: number;
  correlatedDownPct: number; // 0..1, fraction of down events that happen together
}): { mean: number; p05: number; p50: number; p95: number } {
  const trials = Math.max(100, Math.min(20000, Math.floor(params.trials)));
  const correlated = clamp01(params.correlatedDownPct);

  const perTrial: number[] = [];
  for (let t = 0; t < trials; t++) {
    // A toy correlation model: with probability correlated, all components share a common shock.
    const shockDown = Math.random() < correlated ? 1 : 0;

    const up = params.components.map((c) => {
      const ai = clamp01(c.availability);
      if (shockDown) return Math.random() < ai * 0.98; // correlated shock reduces effective availability
      return Math.random() < ai;
    });

    const ok =
      params.composition === "serial"
        ? up.every(Boolean)
        : up.some(Boolean); // parallel: any one works

    perTrial.push(ok ? 1 : 0);
  }

  perTrial.sort((a, b) => a - b);
  const mean = perTrial.reduce((a, b) => a + b, 0) / perTrial.length;
  const at = (p: number) => perTrial[Math.floor((perTrial.length - 1) * p)] ?? 0;
  return { mean, p05: at(0.05), p50: at(0.5), p95: at(0.95) };
}

