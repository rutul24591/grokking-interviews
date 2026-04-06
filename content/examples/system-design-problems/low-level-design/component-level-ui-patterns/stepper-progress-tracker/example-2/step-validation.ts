/**
 * Stepper Validation — Per-step validation gate with async validators.
 *
 * Interview edge case: User tries to advance from step 2 to step 3, but step 2
 * has an async validator (e.g., check if username is available). The "Next" button
 * should show a loading state, disable advancement until validation completes,
 * and display errors if validation fails.
 */

export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export interface StepValidation {
  status: ValidationStatus;
  errors: string[];
}

/**
 * Manages per-step validation with async support.
 */
export class StepperValidation {
  private validations: Map<string, StepValidation> = new Map();
  private pendingValidations: Map<string, Promise<void>> = new Map();

  /**
   * Registers a step with its sync and async validators.
   */
  registerStep(
    stepId: string,
    syncValidators: (() => string | null)[],
    asyncValidators: (() => Promise<string | null>)[] = [],
  ): void {
    this.validations.set(stepId, { status: 'idle', errors: [] });

    // Store validators for later execution
    (this.validations.get(stepId) as any)._syncValidators = syncValidators;
    (this.validations.get(stepId) as any)._asyncValidators = asyncValidators;
  }

  /**
   * Validates a step. Runs sync validators first, then async validators.
   */
  async validateStep(stepId: string): Promise<StepValidation> {
    const validation = this.validations.get(stepId);
    if (!validation) return { status: 'invalid', errors: ['Step not registered'] };

    const step = this.validations.get(stepId) as any;
    const errors: string[] = [];

    // Run sync validators
    for (const validator of step._syncValidators || []) {
      const error = validator();
      if (error) errors.push(error);
    }

    if (errors.length > 0) {
      validation.status = 'invalid';
      validation.errors = errors;
      return { ...validation };
    }

    // Run async validators
    validation.status = 'validating';
    validation.errors = [];

    const asyncErrors: string[] = [];
    await Promise.all(
      (step._asyncValidators || []).map(async (validator: () => Promise<string | null>) => {
        const error = await validator();
        if (error) asyncErrors.push(error);
      }),
    );

    validation.status = asyncErrors.length > 0 ? 'invalid' : 'valid';
    validation.errors = asyncErrors;

    return { ...validation };
  }

  /**
   * Validates all steps up to and including the given step.
   */
  async validateUpTo(stepIds: string[]): Promise<{ allValid: boolean; invalidStep: string | null }> {
    for (const stepId of stepIds) {
      const result = await this.validateStep(stepId);
      if (result.status !== 'valid') {
        return { allValid: false, invalidStep: stepId };
      }
    }
    return { allValid: true, invalidStep: null };
  }

  /**
   * Returns the validation status for a step.
   */
  getValidation(stepId: string): StepValidation {
    return this.validations.get(stepId) || { status: 'idle', errors: [] };
  }
}
