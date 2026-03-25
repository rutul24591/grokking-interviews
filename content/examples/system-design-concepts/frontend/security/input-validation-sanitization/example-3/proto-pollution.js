function unsafeMerge(target, source) {
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      target[k] ??= {};
      unsafeMerge(target[k], v);
      continue;
    }
    target[k] = v;
  }
  return target;
}

function safeMerge(target, source) {
  const blocked = new Set(["__proto__", "constructor", "prototype"]);
  for (const [k, v] of Object.entries(source)) {
    if (blocked.has(k)) continue;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      target[k] ??= {};
      safeMerge(target[k], v);
      continue;
    }
    target[k] = v;
  }
  return target;
}

const payload = JSON.parse('{"__proto__":{"polluted":true},"theme":"dark"}');

const a = unsafeMerge({}, payload);
process.stdout.write(`unsafe merged theme=${a.theme} polluted=${a.polluted}\n`);

const b = safeMerge({}, payload);
process.stdout.write(`safe merged theme=${b.theme} polluted=${b.polluted}\n`);

