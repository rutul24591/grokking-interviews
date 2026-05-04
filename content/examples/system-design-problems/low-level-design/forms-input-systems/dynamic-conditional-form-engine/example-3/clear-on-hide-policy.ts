import type { FieldState, RuleEffect } from "../example-1/rule-engine";

export function shouldClearValue(prev: FieldState, next: FieldState, effect?: RuleEffect) {
  if (!effect?.clearValue) return false;
  // Typical policy: clear only when transitioning from visible->hidden.
  return prev.visible && !next.visible;
}

