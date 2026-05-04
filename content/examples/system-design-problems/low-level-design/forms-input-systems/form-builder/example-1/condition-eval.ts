import type { Condition } from "./schema";

export function evalCondition(
  cond: Condition | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!cond) return true;
  // Defensive: if required dependencies are missing, treat as false to avoid accidental disclosure.
  for (const dep of cond.dependsOn) if (!(dep in values)) return false;
  return cond.when(values);
}

