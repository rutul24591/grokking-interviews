import type { SwipeOptions, SwipeEvent, SwipeHandler } from './gallery-types';

const DEFAULT_THRESHOLD = 50; // px
const DEFAULT_VELOCITY_THRESHOLD = 0.3; // px/ms

/**
 * Touch/mouse swipe detection utility.
 *
 * Attaches to a DOM element and emits swipe events when the
 * user swipes beyond the distance and velocity thresholds.
 * Supports both touch (multi-touch) and mouse (drag) input.
 */
export class SwipeDetector {
  private element: HTMLElement;
  private options: Required<SwipeOptions>;
  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private isTracking = false;
  private activeTouchId: number | null = null;

  constructor(element: HTMLElement, options: SwipeOptions = {}) {
    this.element = element;
    this.options = {
      threshold: options.threshold ?? DEFAULT_THRESHOLD,
      velocityThreshold: options.velocityThreshold ?? DEFAULT_VELOCITY_THRESHOLD,
      onSwipeLeft: options.onSwipeLeft ?? (() => {}),
      onSwipeRight: options.onSwipeRight ?? (() => {}),
      onSwipeUp: options.onSwipeUp ?? (() => {}),
      onSwipeDown: options.onSwipeDown ?? (() => {}),
    };

    this.bindEvents();
  }

  private bindEvents(): void {
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart, {
      passive: true,
    });
    this.element.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    });
    this.element.addEventListener('touchend', this.handleTouchEnd, {
      passive: true,
    });

    // Mouse events (for desktop drag)
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseup', this.handleMouseUp);
    this.element.addEventListener('mouseleave', this.handleMouseUp);
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (e.touches.length !== 1) return; // Only track single-finger swipes
    const touch = e.touches[0];
    this.activeTouchId = touch.identifier;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
    this.isTracking = true;
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.isTracking) return;
    // Prevent scrolling while swiping in the lightbox
    if (Math.abs(this.getTouchDeltaX(e)) > 10) {
      e.preventDefault();
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    if (!this.isTracking) return;
    this.isTracking = false;

    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === this.activeTouchId
    );
    if (!touch) return;

    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;
    const duration = Date.now() - this.startTime;
    const velocity = duration > 0 ? Math.abs(deltaX) / duration : 0;

    this.fireSwipe(deltaX, deltaY, velocity, duration);
    this.activeTouchId = null;
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0) return; // Only left mouse button
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
    this.isTracking = true;
  };

  private handleMouseMove = (_e: MouseEvent): void => {
    // Could add visual feedback here (e.g., drag indicator)
  };

  private handleMouseUp = (e: MouseEvent): void => {
    if (!this.isTracking) return;
    this.isTracking = false;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    const duration = Date.now() - this.startTime;
    const velocity = duration > 0 ? Math.abs(deltaX) / duration : 0;

    this.fireSwipe(deltaX, deltaY, velocity, duration);
  };

  private getTouchDeltaX(e: TouchEvent): number {
    const touch = Array.from(e.touches).find(
      (t) => t.identifier === this.activeTouchId
    );
    return touch ? touch.clientX - this.startX : 0;
  }

  private fireSwipe(
    deltaX: number,
    deltaY: number,
    velocity: number,
    duration: number
  ): void {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if swipe exceeds distance threshold
    if (absDeltaX < this.options.threshold && velocity < this.options.velocityThreshold) {
      return;
    }

    // Determine primary direction (horizontal vs vertical)
    const isHorizontal = absDeltaX > absDeltaY;

    const swipeEvent: SwipeEvent = {
      direction: isHorizontal
        ? deltaX > 0
          ? 'right'
          : 'left'
        : deltaY > 0
          ? 'down'
          : 'up',
      deltaX,
      deltaY,
      velocity,
      duration,
    };

    if (swipeEvent.direction === 'left') {
      this.options.onSwipeLeft(swipeEvent);
    } else if (swipeEvent.direction === 'right') {
      this.options.onSwipeRight(swipeEvent);
    } else if (swipeEvent.direction === 'up') {
      this.options.onSwipeUp(swipeEvent);
    } else {
      this.options.onSwipeDown(swipeEvent);
    }
  }

  /**
   * Removes all event listeners. Call this when the component
   * unmounts to prevent memory leaks.
   */
  destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('mouseleave', this.handleMouseUp);
  }
}
