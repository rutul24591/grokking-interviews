'use client';

import { useCallback, useEffect, useState } from 'react';

type ModalBackdropProps = {
  zIndex: number;
  onDismiss?: () => void;
  closeOnBackdropClick?: boolean;
};

export function ModalBackdrop({
  zIndex,
  onDismiss,
  closeOnBackdropClick = true,
}: ModalBackdropProps) {
  const [isEntering, setIsEntering] = useState(true);

  // Trigger entrance animation after mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsEntering(false);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClick = useCallback(() => {
    if (closeOnBackdropClick && onDismiss) {
      onDismiss();
    }
  }, [closeOnBackdropClick, onDismiss]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      role="presentation"
      aria-hidden="true"
      onClick={handleClick}
      onKeyDown={closeOnBackdropClick ? handleKeyDown : undefined}
      tabIndex={closeOnBackdropClick ? 0 : -1}
      className={`
        fixed inset-0 transition-opacity duration-300 ease-out
        ${isEntering ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        zIndex: zIndex - 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    />
  );
}
