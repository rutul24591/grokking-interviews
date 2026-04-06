import type { DragConfig } from './drag-drop-types';
import { DEFAULT_DRAG_CONFIG } from './drag-drop-types';

interface FlipFrame {
  element: HTMLElement;
  first: DOMRect;
}

/**
 * FLIP Animation Animator
 *
 * FLIP stands for:
 * - First: Record the initial position/size of elements before DOM changes
 * - Last: Record the final position/size after DOM changes
 * - Invert: Apply a transform to move elements back to their First position
 * - Play: Remove the transform with a CSS transition to animate to Last position
 *
 * This technique enables smooth 60fps reordering animations by animating
 * only the `transform` property (GPU-composited) instead of layout properties.
 */
export class FlipAnimator {
  private firstFrames: Map<string, FlipFrame> = new Map();
  private animationFrameId: number | null = null;
  private config: DragConfig;

  constructor(config?: Partial<DragConfig>) {
    this.config = { ...DEFAULT_DRAG_CONFIG, ...config };
  }

  /**
   * First: Capture bounding boxes of all elements before the reorder.
   * Call this BEFORE updating the DOM.
   */
  captureFirst(elements: HTMLElement[]) {
    this.firstFrames.clear();

    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      this.firstFrames.set(element.dataset.itemId || element.id, {
        element,
        first: rect,
      });
    }
  }

  /**
   * Last + Invert + Play: After the DOM has updated with the new order,
   * compute the delta, apply the invert transform, and animate to the
   * final position.
   *
   * Call this AFTER React has re-rendered with the new item order.
   */
  applyFlip(onComplete?: () => void) {
    // Cancel any in-flight animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const animations: { element: HTMLElement; deltaY: number }[] = [];

    this.firstFrames.forEach((frame, id) => {
      const { element, first } = frame;

      // Find the element in the current DOM (it may have moved)
      const currentElement = document.querySelector<HTMLElement>(
        `[data-item-id="${id}"]`
      );

      if (!currentElement) return;

      const last = currentElement.getBoundingClientRect();
      const deltaY = first.top - last.top;

      // Skip if no movement
      if (Math.abs(deltaY) < 1) return;

      // Invert: apply transform to move element back to its First position
      currentElement.style.transition = 'none';
      currentElement.style.transform = `translateY(${deltaY}px)`;
      currentElement.style.willChange = 'transform';

      animations.push({ element: currentElement, deltaY });
    });

    // Play: In the next frame, remove the transform with a transition
    this.animationFrameId = requestAnimationFrame(() => {
      // Force reflow to ensure the browser has applied the invert transform
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight;

      for (const { element } of animations) {
        element.style.transition = `transform ${this.config.animationDuration}ms cubic-bezier(0.2, 0, 0, 1)`;
        element.style.transform = 'translateY(0)';
      }

      // Clean up after animation completes
      this.animationFrameId = window.setTimeout(() => {
        for (const { element } of animations) {
          element.style.transition = '';
          element.style.transform = '';
          element.style.willChange = '';
        }
        this.firstFrames.clear();
        this.animationFrameId = null;
        onComplete?.();
      }, this.config.animationDuration) as unknown as number;
    });
  }

  /**
   * Cancels any in-flight animation and cleans up.
   */
  cancel() {
    if (this.animationFrameId !== null) {
      if (typeof this.animationFrameId === 'number') {
        cancelAnimationFrame(this.animationFrameId);
      } else {
        clearTimeout(this.animationFrameId);
      }
      this.animationFrameId = null;
    }

    this.firstFrames.forEach(({ element }) => {
      element.style.transition = '';
      element.style.transform = '';
      element.style.willChange = '';
    });
    this.firstFrames.clear();
  }

  /**
   * Returns the number of elements that would be animated.
   * Useful for determining if an animation is worth triggering.
   */
  getPendingAnimationCount(): number {
    let count = 0;
    this.firstFrames.forEach((frame, id) => {
      const currentElement = document.querySelector<HTMLElement>(
        `[data-item-id="${id}"]`
      );
      if (currentElement) {
        const last = currentElement.getBoundingClientRect();
        if (Math.abs(frame.first.top - last.top) >= 1) {
          count++;
        }
      }
    });
    return count;
  }
}
