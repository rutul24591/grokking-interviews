/**
 * Autoplay Visibility Awareness — Pauses carousel when tab is not visible.
 *
 * Interview edge case: User switches to another tab while carousel is autoplaying.
 * The carousel continues advancing in the background. When the user returns,
 * they've missed several slides. Solution: pause autoplay on visibility change.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface AutoplayConfig {
  intervalMs: number;
  autoPlay: boolean;
  totalSlides: number;
}

/**
 * Hook that manages autoplay with visibility awareness, pause on interaction, and reset.
 */
export function useAutoplayWithVisibility({ intervalMs, autoPlay, totalSlides }: AutoplayConfig) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserInteractingRef = useRef(false);

  /**
   * Advances to the next slide (wraps around).
   */
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  /**
   * Resets autoplay timer.
   */
  const resetAutoplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isPlaying && !isUserInteractingRef.current) {
      timerRef.current = setTimeout(next, intervalMs);
    }
  }, [isPlaying, intervalMs, next]);

  /**
   * Pauses autoplay on user interaction (hover, focus).
   */
  const pauseOnInteraction = useCallback(() => {
    isUserInteractingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  /**
   * Resumes autoplay when user stops interacting.
   */
  const resumeOnInteractionEnd = useCallback(() => {
    isUserInteractingRef.current = false;
    resetAutoplay();
  }, [resetAutoplay]);

  /**
   * Visibility change handler — pauses when tab is hidden.
   */
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) clearTimeout(timerRef.current);
      } else {
        // Tab is visible again — resume autoplay
        resetAutoplay();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [resetAutoplay]);

  /**
   * Start/stop autoplay.
   */
  useEffect(() => {
    if (isPlaying && !document.hidden && !isUserInteractingRef.current) {
      timerRef.current = setTimeout(next, intervalMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, intervalMs, next]);

  return { currentIndex, isPlaying, setIsPlaying, next, pauseOnInteraction, resumeOnInteractionEnd };
}
