import type { SplitPaneOrientation } from './split-pane-types';

export class PointerDragHandler {
  private pointerId: number | null = null;
  private currentPosition = 0;

  constructor(
    private divider: HTMLElement,
    private orientation: SplitPaneOrientation,
    private onChange: (position: number) => void,
    private onDone: () => void,
  ) {}

  start(clientPos: number, pointerId: number) {
    this.pointerId = pointerId;
    this.currentPosition = clientPos;
    this.divider.setPointerCapture(pointerId);
    this.divider.addEventListener('pointermove', this.onMove);
    this.divider.addEventListener('pointerup', this.onUp);
    this.divider.addEventListener('pointercancel', this.onUp);
  }

  private onMove = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) return;
    e.preventDefault();
    const delta = (this.orientation === 'horizontal' ? e.clientX : e.clientY) - this.currentPosition;
    this.currentPosition += delta;
    this.onChange(this.currentPosition);
  };

  private onUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) return;
    this.divider.releasePointerCapture(this.pointerId);
    this.divider.removeEventListener('pointermove', this.onMove);
    this.divider.removeEventListener('pointerup', this.onUp);
    this.divider.removeEventListener('pointercancel', this.onUp);
    this.pointerId = null;
    this.onDone();
  };
}
