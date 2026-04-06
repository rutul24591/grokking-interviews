/**
 * Form Builder — Staff-Level Form Schema Versioning.
 *
 * Staff differentiator: JSON Schema-based form definitions with version tracking,
 * backward-compatible schema evolution, and migration of submitted form data
 * when the schema changes.
 */

export interface FormSchema {
  version: string;
  steps: FormStep[];
  validation: Record<string, ValidationRule[]>;
  conditions: ConditionalRule[];
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email';
  value?: string | number;
  message: string;
}

export interface ConditionalRule {
  fieldId: string;
  showIf: { fieldId: string; operator: string; value: unknown }[];
}

/**
 * Migrates form submissions between schema versions.
 */
export class FormSchemaMigrator {
  private migrations: Map<string, (data: Record<string, unknown>) => Record<string, unknown>> = new Map();

  /**
   * Registers a migration function between two schema versions.
   */
  register(fromVersion: string, toVersion: string, migrateFn: (data: Record<string, unknown>) => Record<string, unknown>): void {
    this.migrations.set(`${fromVersion}→${toVersion}`, migrateFn);
  }

  /**
   * Migrates form data to the target schema version.
   */
  migrate(data: Record<string, unknown>, fromVersion: string, toVersion: string): Record<string, unknown> {
    let current = { ...data };
    let currentVersion = fromVersion;

    while (currentVersion !== toVersion) {
      const key = `${currentVersion}→${toVersion}`;
      const migrationFn = this.migrations.get(key);

      if (!migrationFn) {
        throw new Error(`No migration path from ${currentVersion} to ${toVersion}`);
      }

      current = migrationFn(current);
      currentVersion = toVersion;
    }

    return current;
  }

  /**
   * Validates form data against the current schema.
   */
  validate(data: Record<string, unknown>, schema: FormSchema): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const step of schema.steps) {
      for (const field of step.fields) {
        const value = data[field.id];

        if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          errors[field.id] = `${field.label} is required`;
          continue;
        }

        if (value && field.validation) {
          for (const rule of field.validation) {
            const error = this.validateRule(value, rule);
            if (error) errors[field.id] = error;
          }
        }
      }
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  private validateRule(value: unknown, rule: ValidationRule): string | null {
    switch (rule.type) {
      case 'minLength':
        return typeof value === 'string' && value.length < (rule.value as number) ? rule.message : null;
      case 'maxLength':
        return typeof value === 'string' && value.length > (rule.value as number) ? rule.message : null;
      case 'pattern':
        return typeof value === 'string' && !new RegExp(rule.value as string).test(value) ? rule.message : null;
      case 'email':
        return typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? rule.message : null;
      default:
        return null;
    }
  }
}
