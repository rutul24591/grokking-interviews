import type { ZoomState, PanBounds } from './gallery-types';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from './gallery-types';

/**
 * Zoom Manager — handles pinch-to-zoom, scroll-zoom,
 * double-click zoom, and pan bounds calculation.
 *
 * Computes the CSS transform matrix from zoom state and
 * ensures the image stays within visible bounds when panning.
 */
export class ZoomManager {
  private containerWidth: number;
  private containerHeight: number;
  private imageWidth: number;
  private imageHeight: number;
  private onZoomChange: (zoom: Partial<ZoomState>) => void;

  constructor(
    containerWidth: number,
    containerHeight: number,
    imageWidth: number,
    imageHeight: number,
    onZoomChange: (zoom: Partial<ZoomState>) => void
  ) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.onZoomChange = onZoomChange;
  }

  /**
   * Updates container/image dimensions. Call on resize.
   */
  updateDimensions(
    containerWidth: number,
    containerHeight: number,
    imageWidth: number,
    imageHeight: number
  ): void {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
  }

  /**
   * Calculates the initial fit-to-screen scale.
   * The image is scaled to fit within the container while
   * maintaining aspect ratio.
   */
  calculateFitScale(): number {
    const scaleX = this.containerWidth / this.imageWidth;
    const scaleY = this.containerHeight / this.imageHeight;
    return Math.min(scaleX, scaleY, 1); // Never scale beyond 1x for fit
  }

  /**
   * Handles pinch-to-zoom.
   *
   * @param initialDistance - Distance between two fingers at pinch start
   * @param currentDistance - Current distance between two fingers
   * @param currentZoom - Current zoom state
   * @returns Updated zoom state
   */
  handlePinchZoom(
    initialDistance: number,
    currentDistance: number,
    currentZoom: ZoomState
  ): ZoomState {
    const ratio = currentDistance / initialDistance;
    const newScale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, currentZoom.scale * ratio)
    );

    return {
      scale: newScale,
      translateX: currentZoom.translateX,
      translateY: currentZoom.translateY,
    };
  }

  /**
   * Handles scroll-wheel zoom on desktop.
   *
   * @param delta - Wheel delta (positive = zoom in, negative = zoom out)
   * @param currentZoom - Current zoom state
   * @returns Updated zoom state
   */
  handleWheelZoom(delta: number, currentZoom: ZoomState): ZoomState {
    const direction = delta > 0 ? 1 : -1;
    const newScale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, currentZoom.scale + direction * ZOOM_STEP)
    );

    return {
      scale: newScale,
      translateX: currentZoom.translateX,
      translateY: currentZoom.translateY,
    };
  }

  /**
   * Handles double-click zoom. Zooms to 2x on first click,
   * back to 1x on second click.
   *
   * @param currentZoom - Current zoom state
   * @returns Updated zoom state
   */
  handleDoubleClickZoom(currentZoom: ZoomState): ZoomState {
    const newScale = currentZoom.scale > 1 ? 1 : 2;
    return {
      scale: newScale,
      translateX: 0,
      translateY: 0,
    };
  }

  /**
   * Handles panning when zoomed in.
   *
   * @param deltaX - Horizontal pan delta
   * @param deltaY - Vertical pan delta
   * @param currentZoom - Current zoom state
   * @returns Updated zoom state with clamped translate
   */
  handlePan(
    deltaX: number,
    deltaY: number,
    currentZoom: ZoomState
  ): ZoomState {
    if (currentZoom.scale <= 1) {
      // No panning needed at 1x zoom
      return currentZoom;
    }

    const bounds = this.calculatePanBounds(currentZoom.scale);
    const newTranslateX = Math.max(
      bounds.minX,
      Math.min(bounds.maxX, currentZoom.translateX + deltaX)
    );
    const newTranslateY = Math.max(
      bounds.minY,
      Math.min(bounds.maxY, currentZoom.translateY + deltaY)
    );

    return {
      ...currentZoom,
      translateX: newTranslateX,
      translateY: newTranslateY,
    };
  }

  /**
   * Calculates the maximum pan offsets that keep the image
   * within the viewport.
   *
   * When zoomed to scale S, the rendered dimensions are:
   *   renderedWidth = imageWidth * S
   *   renderedHeight = imageHeight * S
   *
   * The image can pan within the rectangle that keeps at
   * least some portion of the image visible.
   */
  calculatePanBounds(scale: number): PanBounds {
    const renderedWidth = this.imageWidth * scale;
    const renderedHeight = this.imageHeight * scale;

    // If the image is smaller than the container even when zoomed,
    // center it (no panning needed)
    if (renderedWidth <= this.containerWidth) {
      return {
        minX: 0,
        maxX: 0,
        minY: Math.max(0, (this.containerHeight - renderedHeight) / 2),
        maxY: Math.max(0, (this.containerHeight - renderedHeight) / 2),
      };
    }

    if (renderedHeight <= this.containerHeight) {
      return {
        minX: Math.max(0, (this.containerWidth - renderedWidth) / 2),
        maxX: Math.max(0, (this.containerWidth - renderedWidth) / 2),
        minY: 0,
        maxY: 0,
      };
    }

    // Both dimensions exceed container — pan in both axes
    const halfExcessX = (renderedWidth - this.containerWidth) / 2;
    const halfExcessY = (renderedHeight - this.containerHeight) / 2;

    return {
      minX: -halfExcessX,
      maxX: halfExcessX,
      minY: -halfExcessY,
      maxY: halfExcessY,
    };
  }

  /**
   * Builds the CSS transform string from zoom state.
   * Order matters: scale first, then translate.
   */
  buildTransform(zoom: ZoomState): string {
    return `scale(${zoom.scale}) translate(${zoom.translateX}px, ${zoom.translateY}px)`;
  }

  /**
   * Resets zoom to 1x, centered.
   */
  resetZoom(): ZoomState {
    return {
      scale: 1,
      translateX: 0,
      translateY: 0,
    };
  }
}
