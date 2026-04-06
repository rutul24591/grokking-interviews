'use client';
import { useRef, useCallback, useState } from 'react';

interface AlphaSliderProps {
  value: number;
  baseColor: string; // e.g. 'rgb(59, 130, 246)'
  onChange: (alpha: number) => void;
  className?: string;
}

export function AlphaSlider({ value, baseColor, onChange, className = '' }: AlphaSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const positionToAlpha = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.round((x / rect.width) * 100) / 100;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      draggingRef.current = true;
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onChange(positionToAlpha(e.clientX));
    },
    [onChange, positionToAlpha]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      onChange(positionToAlpha(e.clientX));
    },
    [onChange, positionToAlpha]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onChange(Math.max(0, value - 0.01));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onChange(Math.min(1, value + 0.01));
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange(1);
      }
    },
    [value, onChange]
  );

  // Checkerboard pattern via inline SVG data URI
  const checkerboard =
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\'%3E%3Crect width=\'16\' height=\'16\' fill=\'%23fff\'/%3E%3Crect width=\'8\' height=\'8\' fill=\'%23ccc\'/%3E%3Crect x=\'8\' y=\'8\' width=\'8\' height=\'8\' fill=\'%23ccc\'/%3E%3C/svg%3E")';

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className="w-full h-4 rounded-full cursor-pointer relative overflow-hidden"
        style={{
          backgroundImage: checkerboard,
          backgroundSize: '8px 8px',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Alpha"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={`${Math.round(value * 100)}%`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0) 0%, ${baseColor} 100%)`,
          }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 w-5 h-5 -mt-2.5 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `${value * 100}%`,
            transform: 'translateX(-50%)',
            backgroundColor: baseColor,
            opacity: value,
            transition: isDragging ? 'none' : 'left 0.1s ease-out',
          }}
        />
      </div>
    </div>
  );
}
