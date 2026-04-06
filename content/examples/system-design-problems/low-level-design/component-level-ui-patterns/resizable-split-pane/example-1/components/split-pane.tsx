'use client';
import { useRef, useEffect, useState } from 'react';
import { createSplitPaneStore } from '../lib/split-pane-store';
import { useSplitPane } from '../hooks/use-split-pane';
import type { SplitPaneProps } from '../lib/split-pane-types';

export function SplitPane({ orientation = 'horizontal', firstPane, secondPane, persistenceKey, children }: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(800);
  const storeRef = useRef(createSplitPaneStore({ initialPosition: firstPane.initialSize || 200, containerSize: 800 }));
  const store = storeRef.current;
  const { onPointerDown } = useSplitPane(orientation, firstPane.minSize, secondPane.minSize, store, containerRef);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = orientation === 'horizontal' ? entry.contentRect.width : entry.contentRect.height;
        setContainerSize(size);
        store.getState().setContainerSize(size);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [orientation, store]);

  useEffect(() => {
    if (!persistenceKey) return;
    try {
      const raw = localStorage.getItem(`split-pane:${persistenceKey}`);
      if (raw) {
        const data = JSON.parse(raw);
        store.getState().setDividerPosition(data.position || firstPane.initialSize || 200);
      }
    } catch { /* ignore */ }
  }, [persistenceKey, store, firstPane.initialSize]);

  useEffect(() => {
    if (!persistenceKey) return;
    const pos = store.getState().dividerPosition;
    const timer = setTimeout(() => {
      try { localStorage.setItem(`split-pane:${persistenceKey}`, JSON.stringify({ position: pos })); } catch { /* quota */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [store.getState().dividerPosition, persistenceKey]);

  return (
    <div ref={containerRef} className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} h-full w-full`}>
      <div style={{ flexBasis: 'var(--pane-first-size, 50%)', flexGrow: 0, flexShrink: 0, overflow: 'auto' }}>{children[0]}</div>
      <div
        role="separator"
        aria-orientation={orientation}
        aria-label={`Resize ${orientation === 'horizontal' ? 'left and right' : 'top and bottom'} panels`}
        tabIndex={0}
        className={`bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors cursor-${orientation === 'horizontal' ? 'col' : 'row'}-resize ${orientation === 'horizontal' ? 'w-1' : 'h-1'}`}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          const step = 10;
          const isH = orientation === 'horizontal';
          let newPos = store.getState().dividerPosition;
          if ((isH && e.key === 'ArrowLeft') || (!isH && e.key === 'ArrowUp')) { e.preventDefault(); newPos = Math.max(firstPane.minSize, newPos - step); }
          else if ((isH && e.key === 'ArrowRight') || (!isH && e.key === 'ArrowDown')) { e.preventDefault(); newPos = Math.min(containerSize - secondPane.minSize, newPos + step); }
          else return;
          store.getState().setDividerPosition(newPos);
        }}
      />
      <div style={{ flexBasis: 'var(--pane-second-size, 50%)', flexGrow: 0, flexShrink: 0, overflow: 'auto' }}>{children[1]}</div>
    </div>
  );
}
