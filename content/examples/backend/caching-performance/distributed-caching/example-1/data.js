/**
 * File: data.js
 * What it does: Simulates a slow backend data source with deterministic results.
 */
function sleep(ms) {{
  return new Promise((resolve) => setTimeout(resolve, ms));
}}

async function fetchData(key, latencyMs) {{
  await sleep(latencyMs);
  return {{
    key,
    value: `value-for-${{key}}`,
    ts: new Date().toISOString(),
  }};
}}

module.exports = {{ fetchData }};
