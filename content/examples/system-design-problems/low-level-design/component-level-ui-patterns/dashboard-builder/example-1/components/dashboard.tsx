'use client';
import { useDashboard } from '../hooks/use-dashboard';
import type { Widget } from '../lib/dashboard-types';

export function Dashboard({ initialWidgets }: { initialWidgets: Widget[] }) {
  const { widgets, addWidget, removeWidget, saveLayout } = useDashboard(initialWidgets);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <button onClick={saveLayout} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Save Layout</button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {widgets.map((w) => (
          <div key={w.id} className={`col-span-${w.w} bg-white dark:bg-gray-800 rounded-lg shadow p-4`}>
            <div className="flex justify-between mb-2">
              <h3 className="font-medium text-sm">{w.type}</h3>
              <button onClick={() => removeWidget(w.id)} className="text-xs text-red-500 hover:underline">Remove</button>
            </div>
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">Widget content</div>
          </div>
        ))}
      </div>
    </div>
  );
}
