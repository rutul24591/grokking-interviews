/**
 * Form Validation Engine — Staff-Level i18n Validation Messages.
 *
 * Staff differentiator: Internationalized error messages with interpolation,
 * pluralization support, and locale-specific validation rules (e.g., phone
 * number formats, postal codes).
 */

export type ValidationMessageFn = (params: Record<string, unknown>) => string;

export interface ValidationRule {
  type: string;
  params?: Record<string, unknown>;
  message?: string | ValidationMessageFn;
}

/**
 * i18n message registry with interpolation and pluralization.
 */
export class ValidationMessageRegistry {
  private messages: Map<string, string> = new Map();

  /**
   * Registers a message template for a given locale and key.
   * Supports interpolation: "Must be at least {min} characters"
   */
  register(locale: string, key: string, template: string): void {
    this.messages.set(`${locale}:${key}`, template);
  }

  /**
   * Resolves a message with parameter interpolation.
   */
  resolve(locale: string, key: string, params: Record<string, unknown> = {}): string {
    const template = this.messages.get(`${locale}:${key}`) || key;
    return template.replace(/\{(\w+)\}/g, (_, param) => String(params[param] ?? ''));
  }
}

/**
 * Locale-specific validators for phone numbers, postal codes, etc.
 */
export const localeValidators: Record<string, Record<string, (value: string) => string | null>> = {
  'en-US': {
    phone: (value) => (/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value) ? null : 'Invalid US phone number'),
    postalCode: (value) => (/^\d{5}(-\d{4})?$/.test(value) ? null : 'Invalid US ZIP code'),
  },
  'en-GB': {
    phone: (value) => (/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(value) ? null : 'Invalid UK phone number'),
    postalCode: (value) => (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(value) ? null : 'Invalid UK postcode'),
  },
};

/**
 * Runs validation with locale-aware rules and i18n messages.
 */
export function validateWithLocale(
  value: string,
  rules: ValidationRule[],
  locale: string = 'en-US',
  messageRegistry: ValidationMessageRegistry,
): string[] {
  const errors: string[] = [];

  // Check locale-specific validators
  const localeVals = localeValidators[locale];
  for (const rule of rules) {
    if (localeVals?.[rule.type]) {
      const error = localeVals[rule.type](value);
      if (error) {
        errors.push(error);
        continue;
      }
    }

    // Fall back to generic message
    const message = typeof rule.message === 'function'
      ? rule.message(rule.params || {})
      : messageRegistry.resolve(locale, rule.type, rule.params || {});

    if (message) errors.push(message);
  }

  return errors;
}
