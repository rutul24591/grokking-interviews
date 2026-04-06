import type { SplitPaneOrientation } from './split-pane-types';
import { clampPosition, computeFlexBasis } from './pane-size-calculator';
import type { SplitPaneState } from './split-pane-store';

export function useSplitPane(
  orientation: SplitPaneOrientation,
  minFirst: number,
  minSecond: number,
  store: { getState: () => SplitPaneState; setState: (partial: Partial<SplitPaneState>) => void },
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const divider = e.currentTarget;
    const startPos = orientation === 'horizontal' ? e.clientX : e.clientY;

    store.setState({ isDragging: true });

    const onMove = (ev: PointerEvent) => {
      const currentPos = orientation === 'horizontal' ? ev.clientX : ev.clientY;
      const delta = currentPos - startPos;
      const newPos = store.getState().dividerPosition + delta;
      const clamped = clampPosition(newPos, minFirst, minSecond, store.getState().containerSize);
      store.setState({ dividerPosition: clamped });
      const styles = computeFlexBasis(clamped, store.getState().containerSize);
      if (containerRef.current) {
        containerRef.current.style.setProperty('--pane-first-size', styles.first);
        containerRef.current.style.setProperty('--pane-second-size', styles.second);
      }
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      store.setState({ isDragging: false });
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  return { onPointerDown };
}
