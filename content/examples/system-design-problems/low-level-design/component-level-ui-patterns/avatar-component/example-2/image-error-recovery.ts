/**
 * Avatar — Edge Case: Image Error Recovery Chain.
 *
 * When an avatar image fails to load, fall back through: image → initials → generic icon.
 * Each fallback has its own error handling.
 */

import { useState, useCallback } from 'react';

type AvatarFallback = 'image' | 'initials' | 'icon';

export function useAvatarFallback(src: string, name: string) {
  const [fallback, setFallback] = useState<AvatarFallback>('image');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const onError = useCallback(() => {
    if (fallback === 'image' && retryCount < maxRetries) {
      // Retry with cache-busted URL
      setRetryCount((prev) => prev + 1);
      return;
    }
    if (fallback === 'image') {
      // Generate initials from name
      setFallback('initials');
      return;
    }
    if (fallback === 'initials') {
      // Final fallback: generic icon
      setFallback('icon');
    }
  }, [fallback, retryCount, maxRetries]);

  const retryImage = useCallback(() => {
    setRetryCount(0);
    setFallback('image');
  }, []);

  const getInitials = () => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';
  };

  return { fallback, retryCount, onError, retryImage, getInitials };
}
