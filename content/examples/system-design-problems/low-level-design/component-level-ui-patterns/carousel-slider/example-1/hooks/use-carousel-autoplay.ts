'use client';
import { useRef, useEffect, useCallback, useState } from 'react';

interface UseCarouselAutoplayOptions {
  totalSlides: number;
  interval: number;
  autoPlay: boolean;
  loop: boolean;
  onAdvance: () => void;
}

export function useCarouselAutoplay({
  totalSlides,
  interval,
  autoPlay,
  loop,
  onAdvance,
}: UseCarouselAutoplayOptions) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setProgress(0);
  }, []);

  const scheduleNext = useCallback(() => {
    if (!isPlayingRef.current) return;
    if (!loop) {
      // In non-loop mode the consumer handles boundary checks
    }
    timerRef.current = setTimeout(() => {
      onAdvance();
      setProgress(0);
      lastTickRef.current = performance.now();
      scheduleNext();
    }, interval);
  }, [interval, onAdvance, loop]);

  // Progress animation via rAF
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    lastTickRef.current = performance.now();
    scheduleNext();

    const tick = (now: number) => {
      if (!isPlayingRef.current) return;
      const elapsed = now - lastTickRef.current;
      setProgress(Math.min(elapsed / interval, 1));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimer();
    };
  }, [isPlaying, interval, scheduleNext, clearTimer]);

  // Pause on visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else if (autoPlay) {
        setIsPlaying(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [autoPlay]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(true), []);
  const reset = useCallback(() => {
    clearTimer();
    lastTickRef.current = performance.now();
    if (autoPlay) setIsPlaying(true);
    setProgress(0);
  }, [clearTimer, autoPlay]);

  // Reset on interaction
  const resetOnInteraction = useCallback(() => {
    clearTimer();
    if (autoPlay) {
      lastTickRef.current = performance.now();
      scheduleNext();
    }
  }, [clearTimer, autoPlay, scheduleNext]);

  return {
    isPlaying,
    progress,
    pause,
    resume,
    reset,
    resetOnInteraction,
    setIsPlaying,
  };
}
