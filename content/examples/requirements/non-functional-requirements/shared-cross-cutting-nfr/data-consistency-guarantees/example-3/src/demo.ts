type Clock = Record<string, number>;

function dominates(a: Clock, b: Clock) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let strictly = false;
  for (const k of keys) {
    const av = a[k] ?? 0;
    const bv = b[k] ?? 0;
    if (av < bv) return false;
    if (av > bv) strictly = true;
  }
  return strictly;
}

const c1 = { a: 2, b: 1 };
const c2 = { a: 1, b: 2 };
console.log({ dominates12: dominates(c1, c2), dominates21: dominates(c2, c1), concurrent: !dominates(c1, c2) && !dominates(c2, c1) });

