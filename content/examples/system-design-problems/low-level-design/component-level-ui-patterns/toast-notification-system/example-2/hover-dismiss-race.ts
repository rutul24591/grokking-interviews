/**
 * Hover-Dismiss Race Condition Handler
 *
 * Edge case: User hovers over a toast while it's mid-auto-dismiss.
 *
 * The race condition manifests in three ways:
 *   1. **Stale timer dismissal**: The auto-dismiss timer fires while the user's
 *      cursor is already over the toast. The toast disappears mid-interaction,
 *      breaking the user's intent to click an action button.
 *
 *   2. **Hover-during-exit**: The exit animation has started (opacity fading),
 *      then the user moves the cursor over the fading toast. Should the exit
 *      reverse back to visible? If so, how is the remaining time recalculated?
 *
 *   3. **Pointer capture loss**: On touch devices, a long-press followed by
 *      scroll can trigger pointer events that conflict with the dismiss timer.
 *
 * Strategy: A state machine that tracks remaining time and pauses/resumes
 * the auto-dismiss countdown based on hover state, with a "grace period"
 * to prevent flicker at animation boundaries.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastState = 'entering' | 'visible' | 'pausing' | 'paused' | 'exiting' | 'dismissed';

interface ToastTimingConfig {
  /** Base auto-dismiss duration in ms */
  durationMs: number;
  /** Grace period in ms after exit animation starts where hover can reverse it */
  exitGracePeriodMs: number;
  /** Minimum time a toast must remain visible before auto-dismiss can start */
  minimumVisibleMs: number;
}

interface TimingState {
  /** Current phase of the toast lifecycle */
  state: ToastState;
  /** Total original duration configured */
  totalDuration: number;
  /** How much time remains (in ms) when paused */
  remainingMs: number;
  /** When the current phase started (performance.now()) */
  phaseStartTime: number;
  /** Whether the user is currently hovering */
  isHovering: boolean;
  /** Whether the exit animation has begun (irreversible after grace period) */
  exitAnimationStarted: boolean;
  /** Timestamp when exit animation started (for grace period calculation) */
  exitStartTime: number | null;
}

const DEFAULT_TIMING_CONFIG: ToastTimingConfig = {
  durationMs: 5000,
  exitGracePeriodMs: 300,
  minimumVisibleMs: 1000,
};

// ─── Core timing controller ─────────────────────────────────────────────────

class HoverDismissHandler {
  private config: ToastTimingConfig;
  private timing: TimingState;

  /** RAF handle for the countdown tick */
  private rafId: number | null = null;

  /** Timeout ID for the final dismiss */
  private dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Callback fired when the toast should actually be removed from DOM */
  private onDismiss: () => void;

  /** Callback fired when state changes (for UI re-renders) */
  private onStateChange: (state: ToastState, remainingMs: number) => void;

  constructor(
    config: Partial<ToastTimingConfig> = {},
    onDismiss: () => void,
    onStateChange: (state: ToastState, remainingMs: number) => void,
  ) {
    this.config = { ...DEFAULT_TIMING_CONFIG, ...config };
    this.onDismiss = onDismiss;
    this.onStateChange = onStateChange;

    this.timing = {
      state: 'entering',
      totalDuration: this.config.durationMs,
      remainingMs: this.config.durationMs,
      phaseStartTime: performance.now(),
      isHovering: false,
      exitAnimationStarted: false,
      exitStartTime: null,
    };
  }

  /**
   * Called when the enter animation completes and the toast is fully visible.
   * Transitions to 'visible' state and starts the auto-dismiss countdown.
   *
   * Race condition: If the user has already hovered during the enter animation,
   * we must NOT start the countdown — the toast should remain visible until
   * the user leaves.
   */
  onEnterComplete(): void {
    const elapsed = performance.now() - this.timing.phaseStartTime;

    // Enforce minimum visible time
    const minVisibleRemaining = Math.max(0, this.config.minimumVisibleMs - elapsed);

    this.timing.state = this.timing.isHovering ? 'paused' : 'visible';
    this.timing.remainingMs = this.config.durationMs - Math.max(0, elapsed);
    this.timing.phaseStartTime = performance.now();

    this.onStateChange(this.timing.state, this.timing.remainingMs);

    if (!this.timing.isHovering) {
      this.startCountdown(this.timing.remainingMs + minVisibleRemaining);
    }
  }

  /**
   * Called on mouseenter / pointerenter.
   *
   * Key insight: We don't just "clear the timer." We calculate exactly how
   * much time was remaining so we can resume from that point on mouseleave.
   * This prevents the toast from living forever if the user hovers repeatedly.
   */
  onHoverStart(): void {
    this.timing.isHovering = true;

    // If currently counting down, capture remaining time
    if (this.timing.state === 'visible') {
      const elapsed = performance.now() - this.timing.phaseStartTime;
      this.timing.remainingMs = Math.max(0, this.timing.remainingMs - elapsed);
      this.timing.state = 'paused';
      this.clearDismissTimeout();
    }

    // If exit animation is in the grace period, reverse it
    if (this.timing.state === 'exiting' && this.isWithinExitGracePeriod()) {
      this.reverseExit();
      this.timing.state = 'paused';
      this.onStateChange(this.timing.state, this.timing.remainingMs);
      return;
    }

    // If already exiting past grace period, too late — let it finish
    if (this.timing.state === 'exiting') {
      return;
    }

    this.onStateChange(this.timing.state, this.timing.remainingMs);
  }

  /**
   * Called on mouseleave / pointerleave.
   * Resumes the countdown from where it left off.
   *
   * Edge case: If the toast was already in exit state and the grace period
   * has passed, we do NOT resume — the toast is already gone from the user's
   * perspective.
   */
  onHoverEnd(): void {
    this.timing.isHovering = false;

    // Already dismissed or exiting past grace — no-op
    if (this.timing.state === 'dismissed' || this.timing.state === 'exiting') {
      return;
    }

    if (this.timing.state === 'paused') {
      this.timing.state = 'visible';
      this.timing.phaseStartTime = performance.now();
      this.startCountdown(this.timing.remainingMs);
      this.onStateChange(this.timing.state, this.timing.remainingMs);
    }
  }

  /**
   * Manually dismiss the toast (e.g., user clicked the close button).
   * Bypasses all timing — immediate transition to exit.
   */
  dismiss(): void {
    this.clearDismissTimeout();
    this.cancelRaf();
    this.timing.state = 'exiting';
    this.timing.exitAnimationStarted = true;
    this.timing.exitStartTime = performance.now();
    this.onStateChange('exiting', 0);

    // After exit animation completes, mark as dismissed
    setTimeout(() => {
      this.timing.state = 'dismissed';
      this.onDismiss();
    }, 300); // Match your exit animation duration
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private startCountdown(durationMs: number): void {
    this.clearDismissTimeout();

    this.dismissTimeout = setTimeout(() => {
      this.beginExit();
    }, durationMs);
  }

  private beginExit(): void {
    this.timing.state = 'exiting';
    this.timing.exitAnimationStarted = true;
    this.timing.exitStartTime = performance.now();
    this.onStateChange('exiting', 0);

    // After exit animation completes, actually remove from DOM
    setTimeout(() => {
      // Double-check: if user re-hovered during grace, exit was reversed
      if (this.timing.state === 'exiting') {
        this.timing.state = 'dismissed';
        this.onDismiss();
      }
    }, 300);
  }

  private isWithinExitGracePeriod(): boolean {
    if (!this.timing.exitStartTime) return false;
    const elapsed = performance.now() - this.timing.exitStartTime;
    return elapsed < this.config.exitGracePeriodMs;
  }

  /**
   * Reverse an exit animation — restore the toast to visible state.
   * Recalculates remaining time based on how far into the exit we were.
   */
  private reverseExit(): void {
    this.clearDismissTimeout();

    // If exit just barely started, restore full duration
    // If exit was nearly complete, restore a minimum remaining time
    const exitElapsed = this.timing.exitStartTime
      ? performance.now() - this.timing.exitStartTime
      : 0;
    const exitProgress = Math.min(1, exitElapsed / 300); // 300ms exit animation

    // Remaining time is proportional: if 80% through exit, give back 20% of duration
    // But always ensure at least 1 second so the user can actually interact
    const restoredMs = Math.max(
      1000,
      this.config.durationMs * (1 - exitProgress),
    );

    this.timing.remainingMs = restoredMs;
    this.timing.exitAnimationStarted = false;
    this.timing.exitStartTime = null;
  }

  private clearDismissTimeout(): void {
    if (this.dismissTimeout !== null) {
      clearTimeout(this.dismissTimeout);
    }
    this.dismissTimeout = null;
  }

  private cancelRaf(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = null;
  }

  /** Cleanup — call on component unmount */
  destroy(): void {
    this.clearDismissTimeout();
    this.cancelRaf();
    this.timing.state = 'dismissed';
  }

  /** Current remaining time for UI display (e.g., progress bar) */
  getRemainingMs(): number {
    if (this.timing.state === 'visible') {
      const elapsed = performance.now() - this.timing.phaseStartTime;
      return Math.max(0, this.timing.remainingMs - elapsed);
    }
    return this.timing.remainingMs;
  }

  get state(): ToastState {
    return this.timing.state;
  }
}

// ─── Usage example (commented out) ──────────────────────────────────────────

// const handler = new HoverDismissHandler(
//   { durationMs: 5000, exitGracePeriodMs: 300 },
//   () => {
//     // Remove toast from DOM
//     removeToastFromDOM(toastId);
//   },
//   (state, remainingMs) => {
//     // Update React state — progress bar, opacity, etc.
//     setToastState(toastId, { state, remainingMs });
//   },
// );
//
// // Lifecycle:
// // 1. Toast mounts → enter animation plays
// // 2. Enter complete → handler.onEnterComplete() starts 5s countdown
// // 3. User hovers at t=2s → handler.onHoverStart()
// //    - remainingMs = 3000, state = 'paused'
// //    - countdown cleared, toast stays visible
// // 4. User hovers for 4s, then leaves → handler.onHoverEnd()
// //    - state = 'visible', countdown resumes from 3000ms
// // 5. Auto-dismiss fires → handler.beginExit()
// //    - state = 'exiting', exit animation plays
// // 6. User quickly hovers at t=100ms into exit → handler.onHoverStart()
// //    - Within 300ms grace period → reverseExit() called
// //    - Toast comes back, state = 'paused', remainingMs recalculated
//
// // Cleanup:
// handler.destroy();

export { HoverDismissHandler };
export type { ToastState, TimingState, ToastTimingConfig };
