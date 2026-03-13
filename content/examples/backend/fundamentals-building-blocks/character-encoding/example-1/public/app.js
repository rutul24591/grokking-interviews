/**
 * File: public/app.js
 * What it does: Calls server endpoints to show the scenario behavior.
 */
const output = document.getElementById('output');
const inputEl = document.getElementById('input');
const titleEl = document.getElementById('title');
const focusEl = document.getElementById('focus');

async function loadScenario() {{
  const res = await fetch('/api/scenario');
  const json = await res.json();
  titleEl.textContent = json.scenario.title;
  focusEl.textContent = json.scenario.focus;
}}

async function run() {{
  const input = inputEl.value;
  const res = await fetch(`/api/run?input=${{encodeURIComponent(input)}}`);
  const json = await res.json();
  output.textContent = JSON.stringify(json, null, 2);
}}

document.getElementById('run').addEventListener('click', run);
loadScenario();
