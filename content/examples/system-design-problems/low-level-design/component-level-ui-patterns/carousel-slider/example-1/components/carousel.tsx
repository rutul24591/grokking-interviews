'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { CarouselConfig } from './lib/carousel-types';

export function Carousel({ slides, interval = 5000, loop = true, showDots = true, showArrows = true, autoPlay = true }: CarouselConfig) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    let next = index;
    if (loop) {
      next = ((index % slides.length) + slides.length) % slides.length;
    } else {
      next = Math.max(0, Math.min(index, slides.length - 1));
    }
    setCurrentIndex(next);
  }, [slides.length, loop]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(next, interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentIndex, interval, next]);

  // Pause on hover
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(autoPlay);

  // Keyboard
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === ' ') { e.preventDefault(); setIsPlaying(!isPlaying); }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Slide track */}
      <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0" role="group" aria-roledescription="slide" aria-label={slide.ariaLabel}>
            {slide.content}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70" aria-label="Previous slide">❮</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70" aria-label="Next slide">❯</button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
