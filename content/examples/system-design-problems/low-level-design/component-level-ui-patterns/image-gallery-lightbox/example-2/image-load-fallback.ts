/**
 * Image Load Fallback: Broken Image Detection, Retry with Lower Quality,
 * Placeholder Display
 *
 * EDGE CASE: Images can fail to load for many reasons:
 * - Network error (timeout, connection dropped)
 * - Server returned 404/500
 * - CDN edge hasn't replicated the image yet
 * - Image URL is malformed
 * - Corrupted image data
 *
 * A broken image icon is a poor UX. We need graceful degradation:
 * 1. Detect load failure via onError event
 * 2. Show a placeholder (skeleton/gray box) immediately
 * 3. Optionally retry with a lower-quality/alternate URL
 * 4. After max retries, show a persistent fallback icon
 *
 * INTERVIEW FOLLOW-UP: "How do you handle images that load intermittently?"
 * "What's your fallback strategy for CDN images?"
 */

import { useState, useCallback, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

type ImageLoadStatus = "loading" | "loaded" | "error" | "retrying" | "fallback";

interface ImageFallbackConfig {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Delay between retries (ms) */
  retryDelayMs?: number;
  /**
   * Generate an alternate URL for retry.
   * Receives the original URL and retry attempt number.
   * E.g., switch from high-res to low-res CDN URL.
   */
  generateFallbackUrl?: (originalUrl: string, attempt: number) => string;
  /** Placeholder component shown while loading */
  placeholder?: React.ReactNode;
  /** Fallback component shown after all retries exhausted */
  fallback?: React.ReactNode;
  /** Whether to retry on error (default: true) */
  autoRetry?: boolean;
}

interface UseImageLoadOptions extends ImageFallbackConfig {
  /** The primary image URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
}

interface UseImageLoadReturn {
  status: ImageLoadStatus;
  currentSrc: string;
  retryCount: number;
  /** Manually trigger a retry */
  retry: () => void;
  /** Reset to initial state (e.g., when src changes) */
  reset: () => void;
  /** Whether the image is currently loading (loading or retrying) */
  isLoading: boolean;
  /** Whether a fallback is showing */
  isShowingFallback: boolean;
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

/**
 * Hook that manages image loading with automatic retry and fallback.
 *
 * State machine:
 *   loading → loaded (img onLoad fired)
 *   loading → error (img onError fired)
 *   error → retrying (auto-retry initiated)
 *   retrying → loaded (retry succeeded)
 *   retrying → error (retry failed, increment retryCount)
 *   error → fallback (max retries exceeded)
 *   fallback → retrying (user manually triggered retry)
 *
 * Usage:
 *   const { status, currentSrc, isLoading, imgProps } = useImageLoad({
 *     src: "/images/hero.jpg",
 *     alt: "Hero image",
 *     maxRetries: 2,
 *     generateFallbackUrl: (url, attempt) =>
 *       url.replace("/high-res/", `/low-res-${attempt}/`),
 *   });
 *
 *   <div>
 *     {isLoading && <Skeleton />}
 *     {status === "loaded" && <img {...imgProps} />}
 *     {status === "fallback" && <BrokenImageIcon />}
 *   </div>
 */
export function useImageLoad({
  src,
  alt,
  maxRetries = 2,
  retryDelayMs = 1000,
  generateFallbackUrl,
  autoRetry = true,
}: UseImageLoadOptions): UseImageLoadReturn {
  const [status, setStatus] = useState<ImageLoadStatus>("loading");
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when src changes
  useEffect(() => {
    setStatus("loading");
    setCurrentSrc(src);
    setRetryCount(0);

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, [src]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  /** Trigger a retry attempt */
  const retry = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
    }

    const nextAttempt = retryCount + 1;

    if (nextAttempt > maxRetries && status !== "fallback") {
      // Max retries exceeded — show fallback
      setStatus("fallback");
      return;
    }

    setStatus("retrying");

    // Schedule retry after delay
    retryTimerRef.current = setTimeout(() => {
      // Generate fallback URL if provided
      let nextSrc = src;
      if (generateFallbackUrl) {
        nextSrc = generateFallbackUrl(src, nextAttempt);
      }

      setCurrentSrc(nextSrc);
      setRetryCount(nextAttempt);
      setStatus("loading");
    }, retryDelayMs);
  }, [retryCount, maxRetries, src, generateFallbackUrl, retryDelayMs, status]);

  /** Handle successful image load */
  const handleLoad = useCallback(() => {
    setStatus("loaded");
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  /** Handle image load error */
  const handleError = useCallback(() => {
    if (autoRetry && retryCount < maxRetries) {
      // Auto-retry
      retry();
    } else {
      // Max retries exceeded
      setStatus("fallback");
    }
  }, [autoRetry, retryCount, maxRetries, retry]);

  const reset = useCallback(() => {
    setStatus("loading");
    setCurrentSrc(src);
    setRetryCount(0);
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, [src]);

  const isLoading = status === "loading" || status === "retrying";
  const isShowingFallback = status === "fallback";

  return {
    status,
    currentSrc,
    retryCount,
    retry,
    reset,
    isLoading,
    isShowingFallback,
    handleLoad,
    handleError,
  };
}

// ---------------------------------------------------------------------------
// React Component
// ---------------------------------------------------------------------------

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackConfig?: ImageFallbackConfig;
  /** Placeholder shown while loading */
  placeholder?: React.ReactNode;
  /** Fallback shown after all retries */
  fallback?: React.ReactNode;
}

/**
 * Drop-in image component with built-in loading states and retry.
 *
 * Usage:
 *   <ImageWithFallback
 *     src="/images/hero.jpg"
 *     alt="Hero"
 *     placeholder={<Skeleton />}
 *     fallback={<BrokenImageIcon />}
 *     fallbackConfig={{ maxRetries: 3 }}
 *   />
 */
export function ImageWithFallback({
  src = "",
  alt = "",
  placeholder,
  fallback,
  fallbackConfig,
  className,
  style,
  ...restProps
}: ImageWithFallbackProps): React.ReactElement {
  const {
    status,
    currentSrc,
    isLoading,
    isShowingFallback,
    handleLoad,
    handleError,
  } = useImageLoad({
    src,
    alt,
    ...fallbackConfig,
  });

  const defaultPlaceholder = (
    <div
      style={{
        backgroundColor: "#e0e0e0",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Loading image"
    >
      <span>Loading...</span>
    </div>
  );

  const defaultFallback = (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: 4,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
      }}
      role="img"
      aria-label="Image failed to load"
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span style={{ marginTop: 8, fontSize: 12 }}>Image unavailable</span>
    </div>
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Placeholder layer */}
      {isLoading && (placeholder ?? defaultPlaceholder)}

      {/* Image layer — only render when loaded */}
      {status === "loaded" && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
          style={{ ...style, display: "block", width: "100%", height: "100%", objectFit: "contain" }}
          {...restProps}
        />
      )}

      {/* Fallback layer */}
      {isShowingFallback && (fallback ?? defaultFallback)}
    </div>
  );
}
