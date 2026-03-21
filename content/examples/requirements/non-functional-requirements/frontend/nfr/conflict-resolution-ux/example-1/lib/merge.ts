export function threeWayMergeText(
  base: string,
  local: string,
  remote: string,
): { ok: true; merged: string } | { ok: false; merged: string } {
  if (local === remote) return { ok: true, merged: local };
  if (local === base) return { ok: true, merged: remote };
  if (remote === base) return { ok: true, merged: local };

  const merged =
    `<<<<<<< local\n` +
    local +
    `\n=======\n` +
    remote +
    `\n>>>>>>> remote\n`;
  return { ok: false, merged };
}

