/**
 * File: public/app.js
 * What it does: Calls server endpoints to show cache behavior.
 */
const output = document.getElementById('output');
const keyInput = document.getElementById('key');
const focusEl = document.getElementById('focus');

async function fetchStats() {{
  const res = await fetch('/api/stats');
  const json = await res.json();
  focusEl.textContent = json.scenario.focus;
}}

async function fetchData() {{
  const key = keyInput.value;
  const res = await fetch(`/api/data?key=${{encodeURIComponent(key)}}`);
  const json = await res.json();
  output.textContent = JSON.stringify(json, null, 2);
}}

async function invalidateKey() {{
  const key = keyInput.value;
  const res = await fetch(`/api/invalidate?key=${{encodeURIComponent(key)}}`);
  const json = await res.json();
  output.textContent = JSON.stringify(json, null, 2);
}}

document.getElementById('fetch').addEventListener('click', fetchData);
document.getElementById('invalidate').addEventListener('click', invalidateKey);
fetchStats();
