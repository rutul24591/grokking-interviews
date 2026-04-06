/**
 * Image Load Fallback Chain — Handles broken images with progressive quality reduction.
 *
 * Interview edge case: User's uploaded image URL returns 404. Instead of showing
 * a broken image icon, try progressively: full resolution → thumbnail → placeholder
 * color. Each fallback has lower quality but higher chance of loading.
 */

import { useState, useEffect } from 'react';

interface ImageSource {
  src: string;
  quality: 'original' | 'thumbnail' | 'placeholder';
}

/**
 * Hook that attempts to load images in a fallback chain.
 * Tries each source in order until one loads successfully.
 */
export function useImageFallback(sources: ImageSource[]): {
  currentSrc: string | null;
  quality: ImageSource['quality'] | null;
  isLoading: boolean;
  hasError: boolean;
} {
  const [index, setIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (index >= sources.length) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.onload = () => {
      setCurrentSrc(sources[index].src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIndex((prev) => prev + 1);
    };
    img.src = sources[index].src;

    return () => { img.onload = null; img.onerror = null; };
  }, [index, sources]);

  return {
    currentSrc,
    quality: index < sources.length ? sources[index].quality : null,
    isLoading,
    hasError,
  };
}
