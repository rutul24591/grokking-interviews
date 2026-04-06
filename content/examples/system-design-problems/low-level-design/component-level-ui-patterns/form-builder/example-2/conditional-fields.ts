/**
 * Conditional Fields — Dynamic show/hide based on other field values.
 *
 * Interview edge case: When a field's visibility depends on another field's value,
 * changing the dependency should immediately update visibility AND clear the hidden
 * field's value (to avoid submitting stale data).
 */

import { useMemo, useCallback } from 'react';

export interface ConditionRule {
  fieldId: string;
  operator: 'eq' | 'neq' | 'in' | 'not-in' | 'gt' | 'lt';
  value: unknown;
}

export interface ConditionalField {
  fieldId: string;
  conditions: ConditionRule[];
  logic: 'and' | 'or';
  clearOnHide?: boolean;
}

/**
 * Evaluates a single condition against current field values.
 */
function evaluateCondition(rule: ConditionRule, values: Record<string, unknown>): boolean {
  const actual = values[rule.fieldId];
  switch (rule.operator) {
    case 'eq': return actual === rule.value;
    case 'neq': return actual !== rule.value;
    case 'in': return Array.isArray(rule.value) && rule.value.includes(actual);
    case 'not-in': return Array.isArray(rule.value) && !rule.value.includes(actual);
    case 'gt': return typeof actual === 'number' && actual > (rule.value as number);
    case 'lt': return typeof actual === 'number' && actual < (rule.value as number);
    default: return false;
  }
}

/**
 * Hook that computes visible field IDs based on current values and conditional rules.
 * Returns hidden field IDs that should be cleared.
 */
export function useConditionalFields(
  values: Record<string, unknown>,
  rules: ConditionalField[],
) {
  const visibleIds = useMemo(() => {
    const visible = new Set<string>();
    for (const rule of rules) {
      const matches = rule.logic === 'and'
        ? rule.conditions.every((c) => evaluateCondition(c, values))
        : rule.conditions.some((c) => evaluateCondition(c, values));
      if (matches) visible.add(rule.fieldId);
    }
    return visible;
  }, [values, rules]);

  const hiddenIds = useMemo(() => {
    const allRuleIds = new Set(rules.map((r) => r.fieldId));
    return [...allRuleIds].filter((id) => !visibleIds.has(id));
  }, [visibleIds, rules]);

  return { visibleIds, hiddenIds };
}
