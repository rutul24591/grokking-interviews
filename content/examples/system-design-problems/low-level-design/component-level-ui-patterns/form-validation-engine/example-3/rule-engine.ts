/**
 * Form Validation Engine — Staff-Level Custom Rule Engine.
 *
 * Staff differentiator: Declarative validation rule language with
 * composability, async rule support, and runtime rule compilation
 * from server-defined schemas.
 */

export type RuleType = 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';

export interface ValidationRule {
  type: RuleType;
  value?: string | number | RegExp;
  message: string;
  async?: boolean;
  asyncFn?: (value: unknown) => Promise<string | null>;
}

/**
 * Composable validation rule engine.
 * Supports sync and async rules, custom functions, and runtime compilation.
 */
export class RuleEngine {
  private builtInRules: Record<string, (value: unknown, ruleValue?: unknown) => string | null> = {
    required: (value) => (!value && value !== 0 && value !== false ? 'This field is required' : null),
    minLength: (value, min) => (typeof value === 'string' && value.length < (min as number) ? `Minimum ${min} characters` : null),
    maxLength: (value, max) => (typeof value === 'string' && value.length > (max as number) ? `Maximum ${max} characters` : null),
    min: (value, min) => (typeof value === 'number' && value < (min as number) ? `Minimum value is ${min}` : null),
    max: (value, max) => (typeof value === 'number' && value > (max as number) ? `Maximum value is ${max}` : null),
    email: (value) => (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : null),
    url: (value) => (typeof value === 'string' && !/^https?:\/\/.+/.test(value) ? 'Invalid URL' : null),
    pattern: (value, pattern) => (typeof value === 'string' && !(pattern as RegExp).test(value) ? 'Invalid format' : null),
  };

  /**
   * Validates a value against a set of rules.
   * Returns the first error encountered (fail-fast).
   */
  async validate(value: unknown, rules: ValidationRule[]): Promise<string | null> {
    for (const rule of rules) {
      if (rule.async && rule.asyncFn) {
        const error = await rule.asyncFn(value);
        if (error) return error;
      } else {
        const validator = this.builtInRules[rule.type];
        if (validator) {
          const error = validator(value, rule.value);
          if (error) return rule.message || error;
        }
      }
    }
    return null;
  }

  /**
   * Compiles a server-defined validation schema into executable rules.
   */
  compileSchema(schema: Record<string, ValidationRule[]>): (data: Record<string, unknown>) => Promise<Record<string, string | null>> {
    return async (data) => {
      const errors: Record<string, string | null> = {};
      for (const [field, rules] of Object.entries(schema)) {
        errors[field] = await this.validate(data[field], rules);
      }
      return errors;
    };
  }

  /**
   * Registers a custom rule.
   */
  registerRule(type: string, validator: (value: unknown, ruleValue?: unknown) => string | null): void {
    this.builtInRules[type] = validator;
  }
}
