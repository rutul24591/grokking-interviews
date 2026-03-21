type Clock = Record<string, number>;

function merge(a: Clock, b: Clock): Clock {
  const out: Clock = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
}

function compare(a: Clock, b: Clock): "before" | "after" | "concurrent" | "equal" {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let aLeq = true;
  let bLeq = true;
  let anyDiff = false;
  for (const k of keys) {
    const av = a[k] ?? 0;
    const bv = b[k] ?? 0;
    if (av !== bv) anyDiff = true;
    if (av > bv) aLeq = false;
    if (bv > av) bLeq = false;
  }
  if (!anyDiff) return "equal";
  if (aLeq && !bLeq) return "before";
  if (bLeq && !aLeq) return "after";
  return "concurrent";
}

const a: Clock = { "us-east": 2 };
const b: Clock = { "eu-west": 3 };
console.log(JSON.stringify({ relation: compare(a, b), merged: merge(a, b) }, null, 2));

