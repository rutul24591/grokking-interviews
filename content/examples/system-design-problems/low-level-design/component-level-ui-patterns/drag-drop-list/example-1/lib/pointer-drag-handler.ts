import type { DragState, DragConfig } from './drag-drop-types';
import { DEFAULT_DRAG_CONFIG } from './drag-drop-types';

interface PointerDragHandlerOptions<T = unknown> {
  item: DragState['activeItem'];
  sourceIndex: number;
  sourceColumnId?: string;
  config?: Partial<DragConfig>;
  onDragStart: (state: Omit<DragState, 'isDragging'>) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
}

interface PointerDragHandler {
  onPointerDown: (e: PointerEvent) => void;
  cleanup: () => void;
}

export class PointerDragHandler {
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private isPointerDown = false;
  private isDragging = false;
  private originX = 0;
  private originY = 0;
  private config: DragConfig;

  constructor(private options: PointerDragHandlerOptions) {
    this.config = { ...DEFAULT_DRAG_CONFIG, ...options.config };
  }

  private handlePointerDown = (e: PointerEvent) => {
    // Only handle primary button (left click or touch)
    if (e.button !== 0 && e.pointerType !== 'touch') return;

    e.preventDefault();
    this.isPointerDown = true;
    this.originX = e.clientX;
    this.originY = e.clientY;

    // Capture the pointer to ensure we receive move/up events
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    // Start long-press timer (for touch devices)
    this.longPressTimer = setTimeout(() => {
      if (this.isPointerDown && !this.isDragging) {
        this.initiateDrag(e);
      }
    }, this.config.longPressDelay);

    // Attach move and up listeners to the document
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerup', this.handlePointerUp);
    document.addEventListener('pointercancel', this.handlePointerCancel);
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.isPointerDown || this.isDragging) return;

    const deltaX = e.clientX - this.originX;
    const deltaY = e.clientY - this.originY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if movement threshold is exceeded
    if (distance >= this.config.movementThreshold) {
      // Cancel long-press timer since we're initiating via movement
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
      this.initiateDrag(e);
    }
  };

  private handlePointerUp = (e: PointerEvent) => {
    this.cleanupEventListeners();

    if (this.isDragging) {
      this.isDragging = false;
      this.options.onDragEnd();
    } else {
      // Pointer was released before drag started — cancel
      this.cancelDrag();
    }

    this.isPointerDown = false;
  };

  private handlePointerCancel = () => {
    this.cleanupEventListeners();
    this.cancelDrag();
    this.isPointerDown = false;
  };

  private initiateDrag(e: PointerEvent) {
    if (this.isDragging) return;
    this.isDragging = true;

    // Clear long-press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    this.options.onDragStart({
      activeItem: this.options.item,
      originX: this.originX,
      originY: this.originY,
      pointerX: e.clientX,
      pointerY: e.clientY,
      source: e.pointerType === 'touch' ? 'pointer' : 'pointer',
      sourceIndex: this.options.sourceIndex,
      sourceColumnId: this.options.sourceColumnId,
    });
  }

  private cancelDrag() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    if (this.isDragging) {
      this.isDragging = false;
      this.options.onDragCancel();
    }
  }

  private cleanupEventListeners() {
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
    document.removeEventListener('pointercancel', this.handlePointerCancel);
  }

  cleanup() {
    this.cleanupEventListeners();
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.isPointerDown = false;
    this.isDragging = false;
  }

  /**
   * Returns an object with the onPointerDown handler to spread on the DOM element.
   */
  static create(options: PointerDragHandlerOptions): PointerDragHandler {
    const handler = new PointerDragHandler(options);
    return {
      onPointerDown: handler.handlePointerDown,
      cleanup: () => handler.cleanup(),
    };
  }
}
