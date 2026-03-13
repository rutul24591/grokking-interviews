/**
 * File: simulate.js
 * What it does: Topic-specific simulation logic with simple, deterministic metrics.
 */
function scoreFromInput(input, base) {
  return base + (input.length * 7) % 100;
}

async function runSimulation(input, scenario) {
  const primary = scoreFromInput(input, 30);
  const secondary = scoreFromInput(input, 12);
  return {
    scenario: { title: scenario.title, focus: scenario.focus },
    input,
    behavior: scenario.behavior,
    metrics: {
      service_metric: primary,
      discovery_metric: secondary,
      sampleSize: scenario.knobs.sampleSize,
    },
    ts: new Date().toISOString(),
  };
}

module.exports = { runSimulation };
