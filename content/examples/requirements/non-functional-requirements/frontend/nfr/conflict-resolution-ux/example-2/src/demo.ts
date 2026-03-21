function threeWayMerge(
  base: string,
  local: string,
  remote: string,
): { ok: true; merged: string } | { ok: false; merged: string } {
  if (local === remote) return { ok: true, merged: local };
  if (local === base) return { ok: true, merged: remote };
  if (remote === base) return { ok: true, merged: local };
  const merged =
    `<<<<<<< local\n` + local + `\n=======\n` + remote + `\n>>>>>>> remote\n`;
  return { ok: false, merged };
}

function assert(condition: unknown, msg: string) {
  if (!condition) throw new Error(msg);
}

assert(threeWayMerge("a", "a", "b").merged === "b", "fast-forward local");
assert(threeWayMerge("a", "b", "a").merged === "b", "fast-forward remote");
assert(threeWayMerge("a", "b", "b").merged === "b", "same change");

const c = threeWayMerge("a", "b", "c");
assert(!c.ok && c.merged.includes("<<<<<<<"), "conflict markers");

console.log(JSON.stringify({ ok: true }, null, 2));

