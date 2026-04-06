'use client';
import { useRef, useCallback, useEffect, useState } from 'react';

interface HueSliderProps {
  value: number;
  onChange: (hue: number) => void;
  className?: string;
}

export function HueSlider({ value, onChange, className = '' }: HueSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const hueToPosition = useCallback((hue: number, width: number) => {
    return (hue / 360) * width;
  }, []);

  const positionToHue = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.round((x / rect.width) * 360);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      draggingRef.current = true;
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onChange(positionToHue(e.clientX));
    },
    [onChange, positionToHue]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      onChange(positionToHue(e.clientX));
    },
    [onChange, positionToHue]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onChange(Math.max(0, value - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onChange(Math.min(360, value + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange(360);
      }
    },
    [value, onChange]
  );

  const indicatorPosition = trackRef.current
    ? hueToPosition(value, trackRef.current.offsetWidth)
    : (value / 360) * 100;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className="w-full h-4 rounded-full cursor-pointer relative"
        style={{
          background:
            'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={value}
        aria-valuetext={`${value} degrees`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="absolute top-1/2 w-5 h-5 -mt-2.5 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: typeof indicatorPosition === 'number' ? `${(value / 360) * 100}%` : indicatorPosition,
            transform: 'translateX(-50%)',
            backgroundColor: `hsl(${value}, 100%, 50%)`,
            transition: isDragging ? 'none' : 'left 0.1s ease-out',
          }}
        />
      </div>
    </div>
  );
}
