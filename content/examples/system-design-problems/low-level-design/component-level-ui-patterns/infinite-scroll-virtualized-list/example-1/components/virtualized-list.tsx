// VirtualizedList — Root container with scroll listener, spacer elements,
// sentinel, and integration of virtualizer + infinite scroll.

'use client';

import React, { useRef } from 'react';
import { useVirtualizer } from '../../hooks/use-virtualizer';
import { useInfiniteScroll } from '../../hooks/use-infinite-scroll';
import type { DataSource, InfiniteScrollConfig } from '../../lib/virtualization-types';
import { VirtualizedItem } from './virtualized-item';
import { Sentinel } from './sentinel';
import { FeedSkeleton } from './feed-skeleton';
import { ScrollRestoration } from './scroll-restoration';

interface VirtualizedListProps<T> {
  /** Data source for fetching paginated data */
  dataSource: DataSource<T>;
  /** Configuration for virtualization and infinite scroll */
  config?: Partial<InfiniteScrollConfig>;
  /** Render function for individual items */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Unique key extractor — defaults to item.id or item.key */
  getItemKey?: (item: T, index: number) => string;
  /** CSS class for the list container */
  className?: string;
  /** Height of skeleton rows during loading */
  skeletonHeight?: number;
  /** Number of skeleton rows to show */
  skeletonCount?: number;
  /** Enable scroll restoration from history state */
  enableScrollRestoration?: boolean;
}

export function VirtualizedList<T>({
  dataSource,
  config,
  renderItem,
  getItemKey,
  className = '',
  skeletonHeight = 100,
  skeletonCount = 5,
  enableScrollRestoration = true,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll hook — manages data loading
  const {
    items,
    isLoading,
    error,
    hasMore,
    sentinelRef,
    retry,
  } = useInfiniteScroll<T>({
    dataSource,
    config,
  });

  // Virtualizer hook — manages visible window computation
  const { virtualItems, totalHeight, updateItemSize } = useVirtualizer<T>({
    data: items,
    containerRef,
    estimatedItemSize: config?.estimatedItemSize,
    overscan: config?.overscan,
  });

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ position: 'relative' }}
      role="list"
      aria-busy={isLoading}
      aria-label="Infinite scroll list"
    >
      {/* Scroll restoration */}
      {enableScrollRestoration && (
        <ScrollRestoration containerRef={containerRef} items={items} />
      )}

      {/* Outer spacer — simulates the full content height */}
      <div style={{ position: 'relative', height: `${totalHeight}px`, width: '100%' }}>
        {/* Rendered virtual items */}
        {virtualItems.map((virtualItem) => (
          <VirtualizedItem
            key={virtualItem.key}
            item={virtualItem}
            updateItemSize={updateItemSize}
          >
            {renderItem(virtualItem.data as T, virtualItem.index)}
          </VirtualizedItem>
        ))}

        {/* Loading skeleton at the bottom */}
        {isLoading && virtualItems.length < items.length && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <FeedSkeleton count={skeletonCount} height={skeletonHeight} />
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div
          className="flex flex-col items-center justify-center gap-3 p-6 text-center"
          role="alert"
        >
          <p className="text-sm text-red-500 dark:text-red-400">
            Failed to load more items. Please try again.
          </p>
          <button
            type="button"
            onClick={retry}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Sentinel — triggers loading when visible */}
      {hasMore && <Sentinel sentinelRef={sentinelRef} />}
    </div>
  );
}
