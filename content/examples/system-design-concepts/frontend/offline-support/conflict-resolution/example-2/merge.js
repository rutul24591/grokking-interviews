export function threeWayMerge(ancestor, local, server) {
  const merged = { ...ancestor };
  const conflicts = [];

  for (const key of Object.keys(ancestor)) {
    const ancestorVal = JSON.stringify(ancestor[key]);
    const localVal = JSON.stringify(local[key]);
    const serverVal = JSON.stringify(server[key]);

    if (localVal === ancestorVal && serverVal === ancestorVal) continue;
    if (localVal !== ancestorVal && serverVal === ancestorVal) {
      merged[key] = local[key];
      continue;
    }
    if (localVal === ancestorVal && serverVal !== ancestorVal) {
      merged[key] = server[key];
      continue;
    }
    if (localVal === serverVal) {
      merged[key] = local[key];
      continue;
    }

    conflicts.push({
      field: key,
      ancestor: ancestor[key],
      local: local[key],
      server: server[key]
    });
  }

  return { merged, conflicts };
}

