// FieldConditions — conditional visibility evaluator.
// Evaluates boolean expression trees (AND, OR, NOT) against current form values
// and renders children only when visibility rules pass.

"use client";

import { useMemo } from "react";
import { useFormStore } from "../lib/form-store";
import type {
  ConditionRule,
  SimpleConditionRule,
  CompoundConditionRule,
} from "../lib/form-types";

interface FieldConditionsProps {
  /** The visibility rule to evaluate. */
  rule: ConditionRule;
  /** Field names referenced in the rule (used for subscription optimization). */
  dependencies: string[];
  /** Whether to clear the field value when hidden. */
  clearOnHide?: boolean;
  /** Name of the field being conditionally rendered. */
  fieldName: string;
  /** Child components to render when visible. */
  children: React.ReactNode;
}

/**
 * Extract all field names referenced in a condition rule tree.
 * Used to compute subscription dependencies for the store selector.
 */
export function extractRuleDependencies(rule: ConditionRule): string[] {
  const fields: string[] = [];

  function walk(r: ConditionRule): void {
    if (r.type === "simple") {
      if (!fields.includes(r.sourceField)) {
        fields.push(r.sourceField);
      }
    } else {
      for (const child of r.rules) {
        walk(child);
      }
    }
  }

  walk(rule);
  return fields;
}

/**
 * Evaluate a simple condition rule against the current form values.
 */
function evaluateSimple(
  rule: SimpleConditionRule,
  values: Record<string, unknown>
): boolean {
  const actualValue = values[rule.sourceField];

  switch (rule.operator) {
    case "equals":
      return actualValue === rule.targetValue;

    case "not_equals":
      return actualValue !== rule.targetValue;

    case "contains": {
      if (Array.isArray(actualValue)) {
        return actualValue.includes(rule.targetValue);
      }
      if (typeof actualValue === "string") {
        return actualValue.includes(String(rule.targetValue));
      }
      return false;
    }

    case "greater_than": {
      if (typeof actualValue !== "number" || typeof rule.targetValue !== "number") {
        return false;
      }
      return actualValue > (rule.targetValue as number);
    }

    case "less_than": {
      if (typeof actualValue !== "number" || typeof rule.targetValue !== "number") {
        return false;
      }
      return actualValue < (rule.targetValue as number);
    }

    case "is_empty":
      return (
        actualValue === undefined ||
        actualValue === null ||
        actualValue === "" ||
        (Array.isArray(actualValue) && actualValue.length === 0)
      );

    case "is_not_empty":
      return (
        actualValue !== undefined &&
        actualValue !== null &&
        actualValue !== "" &&
        !(Array.isArray(actualValue) && actualValue.length === 0)
      );

    default:
      return false;
  }
}

/**
 * Recursively evaluate a condition rule (simple or compound) against form values.
 */
function evaluateRule(
  rule: ConditionRule,
  values: Record<string, unknown>
): boolean {
  if (rule.type === "simple") {
    return evaluateSimple(rule, values);
  }

  // Compound rule
  switch (rule.combinator) {
    case "and":
      return rule.rules.every((r) => evaluateRule(r, values));

    case "or":
      return rule.rules.some((r) => evaluateRule(r, values));

    case "not":
      return !rule.rules.every((r) => evaluateRule(r, values));

    default:
      return false;
  }
}

/**
 * Conditional visibility wrapper component.
 * Subscribes to only the fields referenced in the rule for optimal performance.
 * When visibility changes from true to false, optionally clears the field value
 * from the store (controlled by clearOnHide).
 */
export function FieldConditions({
  rule,
  dependencies,
  clearOnHide,
  fieldName,
  children,
}: FieldConditionsProps) {
  // Subscribe to only the fields referenced in the rule
  const relevantValues = useFormStore((state) => {
    const values: Record<string, unknown> = {};
    for (const dep of dependencies) {
      const field = state.fields[dep];
      if (field) {
        values[dep] = field.value;
      }
    }
    return values;
  });

  // Memoize the evaluation — only re-evaluates when a dependency changes
  const isVisible = useMemo(
    () => evaluateRule(rule, relevantValues),
    [rule, relevantValues]
  );

  // When the field becomes hidden and clearOnHide is true, clear its value
  const prevVisibilityRef = typeof window !== "undefined" ? { current: isVisible } : { current: true };

  if (typeof window !== "undefined") {
    if (prevVisibilityRef.current && !isVisible && clearOnHide) {
      const definition = useFormStore.getState().definitions[fieldName];
      if (definition) {
        useFormStore.getState().setFieldValue(fieldName, definition.defaultValue);
      }
    }
    prevVisibilityRef.current = isVisible;
  }

  if (!isVisible) return null;

  return <>{children}</>;
}

/**
 * Hook version for programmatic visibility checks.
 * Returns whether a field should be visible based on its rule.
 */
export function useFieldVisibility(
  fieldName: string,
  rule: ConditionRule | undefined
): boolean {
  const dependencies = useMemo(
    () => (rule ? extractRuleDependencies(rule) : []),
    [rule]
  );

  const relevantValues = useFormStore((state) => {
    const values: Record<string, unknown> = {};
    for (const dep of dependencies) {
      const field = state.fields[dep];
      if (field) {
        values[dep] = field.value;
      }
    }
    return values;
  });

  return useMemo(() => {
    if (!rule) return true; // No rule means always visible
    return evaluateRule(rule, relevantValues);
  }, [rule, relevantValues]);
}
