export type Migration = (values: Record<string, unknown>) => Record<string, unknown>;

export function runMigrations(
  fromVersion: number,
  toVersion: number,
  migrations: Record<number, Migration>,
  values: Record<string, unknown>,
) {
  let current = values;
  for (let v = fromVersion; v < toVersion; v += 1) {
    const mig = migrations[v];
    if (mig) current = mig(current);
  }
  return current;
}

