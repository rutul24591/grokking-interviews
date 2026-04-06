import type {
  ValidationError,
  CrossFieldRule,
  PasswordMatchRule,
  DateRangeRule,
  ConditionalRequiredRule,
} from "./validation-types";

// ─── Dependency Graph ────────────────────────────────────────────────

export class DependencyGraph {
  private graph = new Map<string, Set<string>>();

  /**
   * Register a dependency: targetField depends on sourceField.
   * When sourceField changes, targetField must be revalidated.
   */
  addDependency(sourceField: string, targetField: string): void {
    if (!this.graph.has(sourceField)) {
      this.graph.set(sourceField, new Set());
    }
    this.graph.get(sourceField)!.add(targetField);
  }

  /**
   * Get all fields that depend on the given source field.
   */
  getDependents(sourceField: string): string[] {
    const dependents = this.graph.get(sourceField);
    return dependents ? Array.from(dependents) : [];
  }

  /**
   * Get all transitively dependent fields (cascade) with cycle detection.
   */
  getAllDependents(sourceField: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();

    function traverse(field: string) {
      if (visited.has(field)) return;
      visited.add(field);

      const dependents = this.graph.get(field) || [];
      for (const dep of dependents) {
        if (!visited.has(dep)) {
          result.push(dep);
          traverse.call(this, dep);
        }
      }
    }

    const dependents = this.graph.get(sourceField) || [];
    for (const dep of Array.from(dependents)) {
      if (!visited.has(dep)) {
        result.push(dep);
        traverse.call(this, dep);
      }
    }

    return result;
  }

  /**
   * Clear all dependencies.
   */
  clear(): void {
    this.graph.clear();
  }
}

// ─── Cross-Field Validation Rules ────────────────────────────────────

export function validatePasswordMatch(
  rule: PasswordMatchRule,
  values: Record<string, unknown>
): ValidationError | null {
  const sourceValue = values[rule.sourceField];
  const targetValue = values[rule.targetField];

  // Only validate if both fields have values
  if (
    sourceValue === undefined ||
    sourceValue === null ||
    sourceValue === "" ||
    targetValue === undefined ||
    targetValue === null ||
    targetValue === ""
  ) {
    return null;
  }

  if (sourceValue !== targetValue) {
    return {
      code: "passwordMismatch",
      messageKey: rule.messageKey || "validation.passwordMismatch",
      params: {
        sourceField: rule.sourceField,
        targetField: rule.targetField,
      },
      field: rule.targetField,
    };
  }

  return null;
}

export function validateDateRange(
  rule: DateRangeRule,
  values: Record<string, unknown>
): ValidationError | null {
  const startValue = values[rule.startField];
  const endValue = values[rule.endField];

  // Only validate if both fields have date values
  if (
    startValue === undefined ||
    startValue === null ||
    startValue === "" ||
    endValue === undefined ||
    endValue === null ||
    endValue === ""
  ) {
    return null;
  }

  let startDate: Date;
  let endDate: Date;

  if (startValue instanceof Date) {
    startDate = startValue;
  } else if (typeof startValue === "string") {
    startDate = new Date(startValue);
  } else {
    return null;
  }

  if (endValue instanceof Date) {
    endDate = endValue;
  } else if (typeof endValue === "string") {
    endDate = new Date(endValue);
  } else {
    return null;
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return null;
  }

  if (endDate < startDate) {
    return {
      code: "dateRangeInvalid",
      messageKey: rule.messageKey || "validation.dateRangeInvalid",
      params: {
        startField: rule.startField,
        endField: rule.endField,
      },
      field: rule.endField,
    };
  }

  return null;
}

export function validateConditionalRequired(
  rule: ConditionalRequiredRule,
  values: Record<string, unknown>
): ValidationError | null {
  const sourceValue = values[rule.sourceField];
  const targetValue = values[rule.targetField];

  // Check if condition is met
  if (sourceValue !== rule.sourceValue) {
    return null;
  }

  // Condition is met, target field is required
  if (
    targetValue === undefined ||
    targetValue === null ||
    targetValue === ""
  ) {
    return {
      code: "conditionalRequired",
      messageKey: rule.messageKey || "validation.conditionalRequired",
      params: {
        sourceField: rule.sourceField,
        targetField: rule.targetField,
        sourceValue: String(rule.sourceValue),
      },
      field: rule.targetField,
    };
  }

  return null;
}

// ─── Cross-Field Validator Engine ────────────────────────────────────

export class CrossFieldValidator {
  private graph = new DependencyGraph();
  private rules: CrossFieldRule[] = [];

  constructor(rules: CrossFieldRule[]) {
    this.rules = rules;
    this.buildDependencyGraph();
  }

  /**
   * Build the dependency graph from cross-field rules.
   */
  private buildDependencyGraph(): void {
    this.graph.clear();

    for (const rule of this.rules) {
      if (rule.type === "passwordMatch") {
        // confirmPassword depends on password
        this.graph.addDependency(
          (rule as PasswordMatchRule).sourceField,
          (rule as PasswordMatchRule).targetField
        );
      } else if (rule.type === "dateRange") {
        // endField depends on startField
        this.graph.addDependency(
          (rule as DateRangeRule).startField,
          (rule as DateRangeRule).endField
        );
      } else if (rule.type === "conditionalRequired") {
        // targetField depends on sourceField
        this.graph.addDependency(
          (rule as ConditionalRequiredRule).sourceField,
          (rule as ConditionalRequiredRule).targetField
        );
      }
    }
  }

  /**
   * Validate all cross-field rules against the current form values.
   */
  validateAll(values: Record<string, unknown>): Record<string, ValidationError[]> {
    const errors: Record<string, ValidationError[]> = {};

    for (const rule of this.rules) {
      let error: ValidationError | null = null;

      if (rule.type === "passwordMatch") {
        error = validatePasswordMatch(rule as PasswordMatchRule, values);
      } else if (rule.type === "dateRange") {
        error = validateDateRange(rule as DateRangeRule, values);
      } else if (rule.type === "conditionalRequired") {
        error = validateConditionalRequired(
          rule as ConditionalRequiredRule,
          values
        );
      }

      if (error && error.field) {
        if (!errors[error.field]) {
          errors[error.field] = [];
        }
        errors[error.field].push(error);
      }
    }

    return errors;
  }

  /**
   * Get all fields that need revalidation when the given field changes.
   */
  getDependentFields(changedField: string): string[] {
    return this.graph.getAllDependents(changedField);
  }

  /**
   * Get the dependency graph (for debugging/inspection).
   */
  getGraph(): Map<string, string[]> {
    const result = new Map<string, string[]>();
    for (const [source, targets] of Array.from(this.graph["graph"].entries())) {
      result.set(source, Array.from(targets));
    }
    return result;
  }
}
