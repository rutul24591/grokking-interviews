import type { DraggableItem } from './drag-drop-types';

interface HTML5DragHandlerOptions {
  item: DraggableItem;
  sourceIndex: number;
  sourceColumnId?: string;
  onDragStart: (data: { item: DraggableItem; index: number; columnId?: string }) => void;
  onDragEnd: () => void;
}

interface HTML5DragEvents {
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
}

const DRAG_DATA_KEY = 'application/x-drag-drop-item';

/**
 * HTML5 Drag and Drop API wrapper for interop scenarios.
 * Used when external sources (file explorer, browser tabs) need to
 * interact with the drag-and-drop list.
 */
export class HTML5DragHandler {
  private element: HTMLElement | null = null;

  constructor(private options: HTML5DragHandlerOptions) {}

  /**
   * Attaches HTML5 drag event listeners to the given element.
   */
  attach(element: HTMLElement): HTML5DragEvents {
    this.element = element;

    const handleDragStart = (e: DragEvent) => {
      if (!e.dataTransfer) return;

      const dragData = {
        id: this.options.item.id,
        sourceIndex: this.options.sourceIndex,
        sourceColumnId: this.options.sourceColumnId,
        type: 'internal-reorder',
      };

      e.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'move';

      // Set custom drag image
      const ghost = this.createDragGhost(element);
      if (ghost) {
        e.dataTransfer.setDragImage(ghost, 0, 0);
        // Remove ghost after a frame (browser has captured the image)
        requestAnimationFrame(() => {
          ghost.remove();
        });
      }

      this.options.onDragStart({
        item: this.options.item,
        index: this.options.sourceIndex,
        columnId: this.options.sourceColumnId,
      });
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      // Drop is handled by the target element's listener
    };

    const handleDragEnd = (e: DragEvent) => {
      this.options.onDragEnd();
    };

    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);

    return {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    };
  }

  /**
   * Removes event listeners and the draggable attribute.
   */
  detach(element: HTMLElement, events: HTML5DragEvents) {
    element.removeAttribute('draggable');
    element.removeEventListener('dragstart', events.onDragStart);
    element.removeEventListener('dragover', events.onDragOver);
    element.removeEventListener('drop', events.onDrop);
    element.removeEventListener('dragend', events.onDragEnd);
  }

  /**
   * Parses drag data from the dataTransfer object.
   * Returns null if the data is not from this handler.
   */
  static parseDragData(e: DragEvent): {
    id: string;
    sourceIndex: number;
    sourceColumnId?: string;
    type: string;
  } | null {
    if (!e.dataTransfer) return null;

    const data = e.dataTransfer.getData(DRAG_DATA_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Creates a temporary DOM element to use as the drag image.
   * The element is styled to match the original item but simplified.
   */
  private createDragGhost(sourceElement: HTMLElement): HTMLElement | null {
    const ghost = sourceElement.cloneNode(true) as HTMLElement;
    ghost.style.position = 'absolute';
    ghost.style.top = '-9999px';
    ghost.style.width = `${sourceElement.offsetWidth}px`;
    ghost.style.opacity = '0.85';
    ghost.style.transform = 'scale(1.05)';
    ghost.style.pointerEvents = 'none';
    ghost.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    ghost.style.backgroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-surface') || '#ffffff';

    document.body.appendChild(ghost);
    return ghost;
  }
}
