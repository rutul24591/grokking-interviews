/**
 * Wizard Multi-Step Form — Staff-Level Analytics Integration.
 *
 * Staff differentiator: Step-level analytics tracking, drop-off detection,
 * time-per-step measurement, and A/B testing integration for form optimization.
 */

export interface StepAnalytics {
  stepId: string;
  stepIndex: number;
  enteredAt: number;
  exitedAt?: number;
  completed: boolean;
  validationErrors: number;
  fieldInteractions: Record<string, number>; // fieldId → interaction count
}

/**
 * Tracks user interactions through the wizard form for analytics.
 */
export class WizardAnalyticsTracker {
  private steps: Map<string, StepAnalytics> = new Map();
  private currentStepId: string | null = null;
  private readonly sessionId: string = `wizard_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  /**
   * Called when the user enters a step.
   */
  trackStepEnter(stepId: string, stepIndex: number): void {
    this.steps.set(stepId, {
      stepId,
      stepIndex,
      enteredAt: Date.now(),
      completed: false,
      validationErrors: 0,
      fieldInteractions: {},
    });

    // Send analytics event
    this.sendEvent('step_entered', { stepId, stepIndex, sessionId: this.sessionId });
  }

  /**
   * Called when the user exits a step.
   */
  trackStepExit(stepId: string, completed: boolean): void {
    const step = this.steps.get(stepId);
    if (step) {
      step.exitedAt = Date.now();
      step.completed = completed;
    }

    this.sendEvent('step_exited', { stepId, completed, sessionId: this.sessionId });
  }

  /**
   * Tracks a validation error on a step.
   */
  trackValidationError(stepId: string): void {
    const step = this.steps.get(stepId);
    if (step) {
      step.validationErrors++;
    }
  }

  /**
   * Tracks a field interaction (focus, change, blur).
   */
  trackFieldInteraction(stepId: string, fieldId: string): void {
    const step = this.steps.get(stepId);
    if (step) {
      step.fieldInteractions[fieldId] = (step.fieldInteractions[fieldId] || 0) + 1;
    }
  }

  /**
   * Calculates drop-off rate per step.
   */
  getDropOffRates(): { stepId: string; dropOffRate: number }[] {
    const rates: { stepId: string; dropOffRate: number }[] = [];
    const stepArray = Array.from(this.steps.values()).sort((a, b) => a.stepIndex - b.stepIndex);

    for (let i = 0; i < stepArray.length; i++) {
      const step = stepArray[i];
      const completedCount = stepArray.filter((s) => s.stepIndex >= step.stepIndex && s.completed).length;
      const enteredCount = stepArray.filter((s) => s.stepIndex >= step.stepIndex).length;
      rates.push({
        stepId: step.stepId,
        dropOffRate: enteredCount > 0 ? 1 - completedCount / enteredCount : 0,
      });
    }

    return rates;
  }

  /**
   * Sends an analytics event.
   */
  private sendEvent(event: string, data: Record<string, unknown>): void {
    // In production: send to analytics service (e.g., Google Analytics, Mixpanel)
    console.log(`[Analytics] ${event}:`, data);
  }
}
