// Sentinel — IntersectionObserver target element for triggering page loads.
// A 1px-tall empty div placed at the bottom of the rendered content.

'use client';

import { useEffect, useRef } from 'react';

interface SentinelProps {
  /** Ref callback from the infinite scroll engine's IntersectionObserver */
  sentinelRef: (element: HTMLElement | null) => void;
  /** CSS class for the sentinel element */
  className?: string;
}

export function Sentinel({ sentinelRef, className = '' }: SentinelProps) {
  const divRef = useRef<HTMLDivElement>(null);

  // Forward the ref to the parent's IntersectionObserver
  useEffect(() => {
    sentinelRef(divRef.current);

    return () => {
      sentinelRef(null);
    };
  }, [sentinelRef]);

  return (
    <div
      ref={divRef}
      className={className}
      style={{ height: '1px', width: '100%' }}
      aria-hidden="true"
    />
  );
}
