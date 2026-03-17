/**
 * File: simulate.js
 * What it does: Simulates work that reflects the topic focus.
 */
function sleep(ms) {{
  return new Promise((resolve) => setTimeout(resolve, ms));
}}

async function runSimulation(input, latencyMs) {{
  await sleep(latencyMs);
  return {{
    input,
    output: `simulated-${{input}}`,
    ts: new Date().toISOString(),
  }};
}}

module.exports = {{ runSimulation }};
