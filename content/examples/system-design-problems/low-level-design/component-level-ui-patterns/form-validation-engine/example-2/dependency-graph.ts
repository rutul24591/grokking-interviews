/**
 * Validation Dependency Graph — Re-validates dependent fields when a field changes.
 *
 * Interview edge case: Field C depends on A and B. When A changes, C must be
 * re-validated. Dependencies form a DAG. Must detect and prevent circular
 * dependencies.
 */

export type FieldId = string;
export type ValidatorFn = (value: unknown) => string | null;

/**
 * Manages field dependencies for cross-field validation.
 */
export class ValidationDependencyGraph {
  private dependencies: Map<FieldId, Set<FieldId>> = new Map(); // field → fields that depend on it
  private validators: Map<FieldId, ValidatorFn> = new Map();

  /**
   * Adds a dependency: dependentField depends on dependencyField.
   * When dependencyField changes, dependentField must be re-validated.
   */
  addDependency(dependentField: FieldId, dependencyField: FieldId): void {
    if (!this.dependencies.has(dependencyField)) {
      this.dependencies.set(dependencyField, new Set());
    }
    this.dependencies.get(dependencyField)!.add(dependentField);

    // Detect circular dependencies
    if (this.hasCycle(dependencyField)) {
      this.dependencies.get(dependencyField)!.delete(dependentField);
      throw new Error(`Circular dependency detected: ${dependencyField} → ${dependentField}`);
    }
  }

  /**
   * Returns all fields that need re-validation when the given field changes.
   * Does a BFS through the dependency graph.
   */
  getDependentFields(field: FieldId): FieldId[] {
    const result: FieldId[] = [];
    const queue: FieldId[] = [field];
    const visited = new Set<FieldId>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const dependents = this.dependencies.get(current);
      if (dependents) {
        for (const dep of dependents) {
          if (!visited.has(dep)) {
            result.push(dep);
            queue.push(dep);
          }
        }
      }
    }

    return result;
  }

  private hasCycle(startNode: FieldId): boolean {
    const visited = new Set<FieldId>();
    const stack: FieldId[] = [startNode];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) return true;
      visited.add(current);

      const dependents = this.dependencies.get(current);
      if (dependents) {
        for (const dep of dependents) {
          if (dep === startNode) return true;
          stack.push(dep);
        }
      }
    }

    return false;
  }

  registerValidator(field: FieldId, validator: ValidatorFn): void {
    this.validators.set(field, validator);
  }

  validateField(field: FieldId, value: unknown): string | null {
    const validator = this.validators.get(field);
    return validator ? validator(value) : null;
  }
}
