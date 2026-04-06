'use client';
import { useCallback, useRef } from 'react';

interface CarouselDotsProps {
  total: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  className?: string;
  ariaLabel?: string;
  variant?: 'default' | 'pill' | 'numbered';
}

export function CarouselDots({
  total,
  currentIndex,
  onSelect,
  className = '',
  ariaLabel = 'Carousel slide indicators',
  variant = 'default',
}: CarouselDotsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSelect(Math.max(0, currentIndex - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onSelect(Math.min(total - 1, currentIndex + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        onSelect(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onSelect(total - 1);
      }
    },
    [currentIndex, total, onSelect]
  );

  if (total <= 1) return null;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center gap-2 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === currentIndex;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${i + 1}`}
            aria-controls={`carousel-slide-${i}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(i)}
            className={`transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              variant === 'pill'
                ? `h-1.5 rounded-full ${isActive ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/75'}`
                : variant === 'numbered'
                  ? `w-7 h-7 rounded-full text-xs font-medium ${isActive ? 'bg-white text-gray-900' : 'bg-white/30 text-white hover:bg-white/50'}`
                  : `w-3 h-3 rounded-full ${isActive ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`
            }`}
          >
            {variant === 'numbered' ? i + 1 : <span className="sr-only">Slide {i + 1}</span>}
          </button>
        );
      })}
    </div>
  );
}
