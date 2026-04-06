// Tooltip Delay Manager — Show/hide delay with cancellable timers

interface TimerEntry {
  timerId: ReturnType<typeof setTimeout>;
  onCancel?: () => void;
}

export class DelayManager {
  private showTimers = new Map<string, TimerEntry>();
  private hideTimers = new Map<string, TimerEntry>();

  scheduleShow(
    id: string,
    delay: number,
    onShow: () => void,
    onCancel?: () => void
  ): void {
    // Cancel any existing show timer for this ID
    this.clearShow(id);

    const timerId = setTimeout(() => {
      this.showTimers.delete(id);
      onShow();
    }, delay);

    this.showTimers.set(id, { timerId, onCancel });
  }

  scheduleHide(
    id: string,
    delay: number,
    onHide: () => void
  ): void {
    // Cancel any existing hide timer for this ID
    this.clearHide(id);

    const timerId = setTimeout(() => {
      this.hideTimers.delete(id);
      onHide();
    }, delay);

    this.hideTimers.set(id, { timerId });
  }

  clearShow(id: string): void {
    const entry = this.showTimers.get(id);
    if (entry) {
      clearTimeout(entry.timerId);
      entry.onCancel?.();
      this.showTimers.delete(id);
    }
  }

  clearHide(id: string): void {
    const entry = this.hideTimers.get(id);
    if (entry) {
      clearTimeout(entry.timerId);
      this.hideTimers.delete(id);
    }
  }

  clearAll(exceptId?: string): void {
    for (const [id, entry] of this.showTimers) {
      if (id !== exceptId) {
        clearTimeout(entry.timerId);
        entry.onCancel?.();
      }
    }
    for (const [id, entry] of this.hideTimers) {
      if (id !== exceptId) {
        clearTimeout(entry.timerId);
      }
    }
    if (!exceptId) {
      this.showTimers.clear();
      this.hideTimers.clear();
    } else {
      this.showTimers.delete(exceptId);
      this.hideTimers.delete(exceptId);
    }
  }

  hasPendingShow(id: string): boolean {
    return this.showTimers.has(id);
  }

  hasPendingHide(id: string): boolean {
    return this.hideTimers.has(id);
  }

  destroy(): void {
    this.clearAll();
  }
}
