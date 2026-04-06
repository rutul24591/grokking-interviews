'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import type { Widget, WidgetType } from '../lib/dashboard-types';

interface WidgetFrameProps {
  widget: Widget;
  onRemove?: (id: string) => void;
  onResize?: (id: string, w: number, h: number) => void;
}

/**
 * Widget container with lazy loading via IntersectionObserver.
 * The widget content (data fetch + render) is deferred until the frame
 * scrolls into the viewport. Shows a skeleton placeholder while loading.
 */
export function WidgetFrame({ widget, onRemove, onResize }: WidgetFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  // ─── IntersectionObserver for lazy loading ──────────────────────────────
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { rootMargin: '200px' } // Start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  // ─── Fetch widget data when visible ─────────────────────────────────────
  useEffect(() => {
    if (!isVisible || hasLoaded) return;

    let cancelled = false;

    (async () => {
      try {
        // In production this would be a real API call keyed by widget type + config.
        // Simulating with a timeout + mock data.
        await new Promise((r) => setTimeout(r, 500));

        if (cancelled) return;

        const mockData: Record<WidgetType, Record<string, unknown>> = {
          'line-chart': { labels: ['Jan', 'Feb', 'Mar'], values: [30, 50, 70] },
          'bar-chart': { labels: ['A', 'B', 'C'], values: [10, 25, 15] },
          'metric-card': { value: 1234, change: 12 },
          'table': { columns: ['Name', 'Value'], rows: [['Alpha', '100'], ['Beta', '200']] },
          'pie-chart': { segments: [{ label: 'X', value: 40 }, { label: 'Y', value: 60 }] },
        };

        setData(mockData[widget.type] ?? {});
        setHasLoaded(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load widget');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isVisible, hasLoaded, widget.type]);

  // ─── Resize handle (bottom-right corner drag) ───────────────────────────
  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = widget.w;
      const startH = widget.h;
      const GRID_UNIT = 64; // pixels per grid unit

      const onMove = (ev: PointerEvent) => {
        const dw = Math.round((ev.clientX - startX) / GRID_UNIT);
        const dh = Math.round((ev.clientY - startY) / GRID_UNIT);
        const newW = Math.max(1, Math.min(12, startW + dw));
        const newH = Math.max(1, startH + dh);
        onResize?.(widget.id, newW, newH);
      };

      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [widget.id, widget.w, widget.h, onResize]
  );

  // ─── Grid column span (dynamic Tailwind) ────────────────────────────────
  const colSpanClass = `col-span-${Math.min(widget.w, 12)}`;

  return (
    <div
      ref={frameRef}
      className={`${colSpanClass} bg-white dark:bg-gray-800 rounded-lg shadow relative group`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
          {widget.type.replace('-', ' ')}
        </span>
        <button
          onClick={() => onRemove?.(widget.id)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          aria-label={`Remove ${widget.type} widget`}
        >
          ✕
        </button>
      </div>

      {/* Content area */}
      <div className="p-4 min-h-[128px]">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500 text-sm">
            {error}
          </div>
        ) : !isVisible || !hasLoaded ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ) : (
          <WidgetContent type={widget.type} data={data} />
        )}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
        onPointerDown={onResizePointerDown}
        aria-label="Resize widget"
      >
        <svg viewBox="0 0 16 16" className="w-full h-full text-gray-500" fill="currentColor">
          <path d="M14 14L8 14L14 8L14 14ZM14 2L2 14L4 14L14 4L14 2Z" />
        </svg>
      </div>
    </div>
  );
}

// ─── Content renderer per widget type ───────────────────────────────────────

function WidgetContent({ type, data }: { type: WidgetType; data: Record<string, unknown> | null }) {
  if (!data) return null;

  switch (type) {
    case 'metric-card': {
      const value = data.value as number;
      const change = data.change as number;
      return (
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value.toLocaleString()}</p>
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        </div>
      );
    }
    case 'line-chart':
    case 'bar-chart': {
      const labels = data.labels as string[];
      const values = data.values as number[];
      const max = Math.max(...values, 1);
      return (
        <div className="flex items-end gap-2 h-24">
          {labels.map((label, i) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-full rounded-t ${type === 'line-chart' ? 'bg-blue-400' : 'bg-indigo-400'}`}
                style={{ height: `${(values[i] / max) * 100}%`, minHeight: 4 }}
              />
              <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">{label}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'pie-chart': {
      const segments = data.segments as { label: string; value: number }[];
      const total = segments.reduce((sum, s) => sum + s.value, 0);
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      let cumulative = 0;
      return (
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 36 36" className="w-20 h-20">
            {segments.map((seg, i) => {
              const pct = (seg.value / total) * 100;
              const dasharray = `${pct} ${100 - pct}`;
              const dashoffset = -cumulative;
              cumulative += pct;
              return (
                <circle
                  key={seg.label}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth="3"
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                  transform="rotate(-90 18 18)"
                />
              );
            })}
          </svg>
          <div className="space-y-1">
            {segments.map((seg, i) => (
              <div key={seg.label} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-gray-600 dark:text-gray-400">{seg.label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{seg.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'table': {
      const columns = data.columns as string[];
      const rows = data.rows as string[][];
      return (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((col) => (
                <th key={col} className="text-left py-1 px-2 text-gray-500 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100 dark:border-gray-800">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-1 px-2 text-gray-900 dark:text-gray-100">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    default:
      return <p className="text-sm text-gray-500">Unknown widget type</p>;
  }
}
