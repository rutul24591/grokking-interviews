'use client';
import { useState, useCallback } from 'react';
import type { Widget, WidgetType } from '../lib/dashboard-types';

interface WidgetCatalogProps {
  onAdd: (widget: Widget) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface CatalogItem {
  type: WidgetType;
  label: string;
  description: string;
  defaultSize: { w: number; h: number };
  icon: string;
}

const CATALOG: CatalogItem[] = [
  { type: 'line-chart', label: 'Line Chart', description: 'Time-series trends', defaultSize: { w: 6, h: 2 }, icon: '📈' },
  { type: 'bar-chart', label: 'Bar Chart', description: 'Categorical comparisons', defaultSize: { w: 4, h: 2 }, icon: '📊' },
  { type: 'metric-card', label: 'Metric Card', description: 'KPI with change %', defaultSize: { w: 3, h: 1 }, icon: '🔢' },
  { type: 'pie-chart', label: 'Pie Chart', description: 'Part-to-whole breakdown', defaultSize: { w: 4, h: 2 }, icon: '🥧' },
  { type: 'table', label: 'Data Table', description: 'Tabular data view', defaultSize: { w: 6, h: 2 }, icon: '📋' },
];

/**
 * Widget catalog modal/panel.
 * Lets users browse available widgets and add them to the dashboard.
 * Each catalog item shows an icon, label, and description.
 */
export function WidgetCatalog({ onAdd, isOpen, onClose }: WidgetCatalogProps) {
  const [filter, setFilter] = useState<WidgetType | 'all'>('all');

  const handleAdd = useCallback(
    (item: CatalogItem) => {
      const widget: Widget = {
        id: `widget-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: item.type,
        x: 0,
        y: 0,
        w: item.defaultSize.w,
        h: item.defaultSize.h,
        config: {},
      };
      onAdd(widget);
      onClose();
    },
    [onAdd, onClose]
  );

  const filtered = filter === 'all' ? CATALOG : CATALOG.filter((item) => item.type === filter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Widget Catalog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Widget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close catalog"
          >
            ✕
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {CATALOG.map((item) => (
            <button
              key={item.type}
              onClick={() => setFilter(item.type)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                filter === item.type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Widget grid */}
        <div className="p-6 grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item.type}
              onClick={() => handleAdd(item)}
              className="flex flex-col items-start gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-left group"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-500">
                {item.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
                {item.defaultSize.w}×{item.defaultSize.h} grid
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
          Click a widget to add it to your dashboard. Drag to reposition, resize from the corner handle.
        </div>
      </div>
    </div>
  );
}
