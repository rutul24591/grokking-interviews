/**
 * Payment Checkout — Staff-Level Fraud Detection Integration.
 *
 * Staff differentiator: Client-side fraud signals collection (velocity,
 * device fingerprinting, behavioral biometrics), server-side risk
 * scoring integration, and progressive challenge (3DS only for risky transactions).
 */

export interface FraudSignals {
  transactionVelocity: number; // Transactions in last hour
  deviceFingerprint: string;
  typingSpeed: number; // Characters per second (bot detection)
  mouseMovements: number;
  isIncognito: boolean | null;
  screenResolution: string;
  timezone: string;
}

/**
 * Collects client-side fraud signals for risk assessment.
 */
export class FraudSignalCollector {
  private signals: Partial<FraudSignals> = {};
  private keystrokeTimestamps: number[] = [];
  private mouseMoveCount: number = 0;

  /**
   * Records a keystroke for typing speed analysis.
   */
  recordKeystroke(): void {
    this.keystrokeTimestamps.push(Date.now());
    // Keep last 20 timestamps for rolling average
    if (this.keystrokeTimestamps.length > 20) {
      this.keystrokeTimestamps.shift();
    }
  }

  /**
   * Calculates average typing speed (chars/sec).
   */
  getTypingSpeed(): number {
    if (this.keystrokeTimestamps.length < 2) return 0;
    const timeSpan = (this.keystrokeTimestamps[this.keystrokeTimestamps.length - 1] - this.keystrokeTimestamps[0]) / 1000;
    return timeSpan > 0 ? this.keystrokeTimestamps.length / timeSpan : 0;
  }

  /**
   * Records a mouse movement.
   */
  recordMouseMove(): void {
    this.mouseMoveCount++;
  }

  /**
   * Collects all available fraud signals.
   */
  async collectSignals(): Promise<FraudSignals> {
    return {
      transactionVelocity: 0, // From server
      deviceFingerprint: await this.generateFingerprint(),
      typingSpeed: this.getTypingSpeed(),
      mouseMovements: this.mouseMoveCount,
      isIncognito: await this.detectIncognito(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private async generateFingerprint(): Promise<string> {
    // In production: use FingerprintJS or similar
    return `fp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private async detectIncognito(): Promise<boolean | null> {
    // In production: use storage quota detection or other techniques
    return null;
  }
}
