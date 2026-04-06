/**
 * Dynamic Height Items: Variable Height Virtualization, Height Cache
 * Invalidation on Content Change, Overscan Adjustment
 *
 * EDGE CASE: Virtualized lists (react-window, react-virtuoso) assume items
 * have known, fixed heights for calculating scroll positions. When items have
 * variable heights:
 * 1. The scroll bar thumb jumps around as actual heights differ from estimates
 * 2. Scrolling fast can cause blank spots (estimated items not yet measured)
 * 3. Content changes (e.g., text expansion, image load) invalidate cached heights
 * 4. Mobile screens with dynamic keyboards change the available viewport height
 *
 * SOLUTION: Maintain a height cache (Map<itemIndex, actualHeight>) with
 * fallback estimates. When an item renders, measure its actual height and
 * update the cache. On content change, invalidate the cache entry. Adjust
 * overscan (items rendered beyond viewport) based on height variance.
 *
 * INTERVIEW FOLLOW-UP: "How does react-window handle variable height items?"
 * "What happens to the scroll bar when heights change?"
 */

import { useState, useCallback, useRef, useMemo, useEffect } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface ItemSizeCache {
  /** Map from item index to its measured height in pixels */
  heights: Map<number, number>;
  /** Default estimated height for unmeasured items */
  estimatedHeight: number;
  /** Total estimated scroll height (sum of all known + estimated heights) */
  totalHeight: number;
  /** How many items have been measured */
  measuredCount: number;
  /** Total item count */
  totalCount: number;
}

interface VariableSizeConfig {
  /** Total number of items */
  itemCount: number;
  /** Default estimated height for unmeasured items */
  estimatedHeight?: number;
  /**
   * Additional overscan multiplier based on height variance.
   * Higher variance = more overscan needed to prevent blank spots.
   */
  overscanMultiplier?: number;
  /** Callback when the total height estimate changes significantly */
  onTotalHeightChange?: (totalHeight: number) => void;
}

interface UseVariableSizeListReturn {
  /** Function to get the size of an item at a given index */
  getItemSize: (index: number) => number;
  /** Ref callback to attach to each item element for measurement */
  measureRef: (index: number) => (el: HTMLElement | null) => void;
  /** Reset the entire size cache (e.g., when data changes) */
  resetCache: () => void;
  /** Invalidate a specific item's cached height */
  invalidateItem: (index: number) => void;
  /** Current cache statistics */
  cacheStats: {
    measuredCount: number;
    totalCount: number;
    coveragePercent: number;
    totalHeight: number;
  };
  /** Recommended overscan count based on current variance */
  recommendedOverscan: number;
}

// ---------------------------------------------------------------------------
// Size Cache Implementation
// ---------------------------------------------------------------------------

/**
 * Creates and manages an item size cache for variable-height virtualization.
 *
 * The cache maps item indices to their measured heights. For unmeasured
 * items, returns the estimated height.
 *
 * When an item's actual height is measured, the cache updates and triggers
 * a re-render (via the state setter). The virtualization library uses
 * `getItemSize(index)` to calculate scroll positions.
 */
function createSizeCache(
  itemCount: number,
  estimatedHeight: number
): ItemSizeCache {
  return {
    heights: new Map(),
    estimatedHeight,
    measuredCount: 0,
    totalCount: itemCount,
    totalHeight: itemCount * estimatedHeight,
  };
}

/**
 * Get the size of an item. Returns measured height if available,
 * otherwise returns the estimated height.
 */
function getItemSizeFromCache(cache: ItemSizeCache, index: number): number {
  return cache.heights.get(index) ?? cache.estimatedHeight;
}

/**
 * Update the cache with a newly measured height.
 * Returns a new cache object (immutable update).
 */
function updateItemSize(
  cache: ItemSizeCache,
  index: number,
  height: number
): ItemSizeCache {
  const previousHeight = cache.heights.get(index);
  const newHeights = new Map(cache.heights);
  newHeights.set(index, height);

  const isMeasured = !cache.heights.has(index);
  const measuredCount = isMeasured
    ? cache.measuredCount + 1
    : cache.measuredCount;

  // Update total height: subtract previous estimate/height, add new height
  const previousValue = previousHeight ?? cache.estimatedHeight;
  const totalHeight = cache.totalHeight - previousValue + height;

  return {
    heights: newHeights,
    estimatedHeight: cache.estimatedHeight,
    measuredCount,
    totalCount: cache.totalCount,
    totalHeight,
  };
}

/**
 * Invalidate a specific item's cached height.
 */
function invalidateItemSize(
  cache: ItemSizeCache,
  index: number
): ItemSizeCache {
  if (!cache.heights.has(index)) {
    return cache;
  }

  const newHeights = new Map(cache.heights);
  const removedHeight = newHeights.get(index)!;
  newHeights.delete(index);

  return {
    heights: newHeights,
    estimatedHeight: cache.estimatedHeight,
    measuredCount: cache.measuredCount - 1,
    totalCount: cache.totalCount,
    totalHeight: cache.totalHeight - removedHeight + cache.estimatedHeight,
  };
}

/**
 * Calculate recommended overscan based on height variance.
 *
 * Higher variance (items have very different heights) → more overscan
 * needed to prevent blank spots during fast scrolling.
 *
 * Formula: baseOverscan * (1 + coefficientOfVariation)
 * where CV = stddev / mean of measured heights.
 */
function calculateRecommendedOverscan(cache: ItemSizeCache): number {
  const baseOverscan = 5; // Default: render 5 items beyond viewport

  if (cache.measuredCount < 3) {
    // Not enough data — use base overscan
    return baseOverscan;
  }

  const heights = Array.from(cache.heights.values());
  const mean = heights.reduce((a, b) => a + b, 0) / heights.length;

  if (mean === 0) return baseOverscan;

  const variance =
    heights.reduce((sum, h) => sum + Math.pow(h - mean, 2), 0) /
    heights.length;
  const stddev = Math.sqrt(variance);
  const coefficientOfVariation = stddev / mean;

  // Scale overscan: CV of 0.5 → 1.5x overscan, CV of 1.0 → 2x overscan
  const multiplier = 1 + coefficientOfVariation;
  return Math.ceil(baseOverscan * Math.min(multiplier, 3)); // Cap at 3x
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

/**
 * Hook that manages variable-size item virtualization.
 *
 * Usage with react-window's VariableSizeList:
 *
 *   const { getItemSize, measureRef, resetCache } = useVariableSizeList({
 *     itemCount: data.length,
 *     estimatedHeight: 80,
 *   });
 *
 *   <VariableSizeList
 *     itemCount={data.length}
 *     itemSize={getItemSize}
 *     overscanCount={recommendedOverscan}
 *   >
 *     {({ index, style }) => (
 *       <div ref={measureRef(index)} style={style}>
 *         <Item data={data[index]} />
 *       </div>
 *     )}
 *   </VariableSizeList>
 *
 * The key pattern: attach `measureRef(index)` to each item element.
 * The ref callback uses ResizeObserver to detect height changes and
 * updates the cache automatically.
 */
export function useVariableSizeList({
  itemCount,
  estimatedHeight = 80,
  overscanMultiplier = 1.5,
  onTotalHeightChange,
}: VariableSizeConfig): UseVariableSizeListReturn {
  const [cache, setCache] = useState<ItemSizeCache>(() =>
    createSizeCache(itemCount, estimatedHeight)
  );

  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const pendingMeasurementsRef = useRef<Map<number, number>>(new Map());

  // Reset cache when item count changes (data was replaced)
  useEffect(() => {
    setCache(createSizeCache(itemCount, estimatedHeight));
  }, [itemCount, estimatedHeight]);

  // Notify when total height changes significantly
  useEffect(() => {
    onTotalHeightChange?.(cache.totalHeight);
  }, [cache.totalHeight, onTotalHeightChange]);

  /**
   * Get the size of an item at the given index.
   * This is passed to the virtualization library as `itemSize`.
   */
  const getItemSize = useCallback(
    (index: number): number => {
      return getItemSizeFromCache(cache, index);
    },
    [cache]
  );

  /**
   * Create a ref callback for measuring an item at the given index.
   *
   * The callback:
   * 1. Attaches a ResizeObserver to the element
   * 2. On resize, measures the new height
   * 3. Updates the cache if the height changed
   *
   * IMPORTANT: This callback is stable (same reference across renders)
   * because it uses refs internally. This prevents the virtualization
   * library from re-measuring on every render.
   */
  const measureRef = useCallback(
    (index: number) => {
      return (el: HTMLElement | null) => {
        // Clean up previous observer
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }

        if (!el) return;

        // Measure immediately if the element has a height
        const height = el.offsetHeight;
        if (height > 0) {
          setCache((prev) => {
            const cachedHeight = prev.heights.get(index);
            if (cachedHeight !== height) {
              return updateItemSize(prev, index, height);
            }
            return prev;
          });
        }

        // Set up ResizeObserver for dynamic height changes
        resizeObserverRef.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const newHeight = Math.round(entry.contentRect.height);

            if (newHeight > 0) {
              pendingMeasurementsRef.current.set(index, newHeight);

              // Batch updates to avoid excessive re-renders
              requestAnimationFrame(() => {
                const pendingHeight = pendingMeasurementsRef.current.get(index);
                if (pendingHeight !== undefined) {
                  pendingMeasurementsRef.current.delete(index);
                  setCache((prev) => {
                    const cachedHeight = prev.heights.get(index);
                    if (cachedHeight !== pendingHeight) {
                      return updateItemSize(prev, index, pendingHeight);
                    }
                    return prev;
                  });
                }
              });
            }
          }
        });

        resizeObserverRef.current.observe(el);
      };
    },
    [] // Stable callback — no dependencies
  );

  const resetCache = useCallback(() => {
    setCache(createSizeCache(itemCount, estimatedHeight));
  }, [itemCount, estimatedHeight]);

  const invalidateItem = useCallback((index: number) => {
    setCache((prev) => invalidateItemSize(prev, index));
  }, []);

  const coveragePercent =
    cache.totalCount > 0
      ? Math.round((cache.measuredCount / cache.totalCount) * 100)
      : 0;

  const recommendedOverscan = Math.ceil(
    calculateRecommendedOverscan(cache) * overscanMultiplier
  );

  return {
    getItemSize,
    measureRef,
    resetCache,
    invalidateItem,
    cacheStats: {
      measuredCount: cache.measuredCount,
      totalCount: cache.totalCount,
      coveragePercent,
      totalHeight: cache.totalHeight,
    },
    recommendedOverscan,
  };
}
