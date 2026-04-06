import { useState, useCallback } from 'react';
import type { Widget } from '../lib/dashboard-types';

export function useDashboard(initialWidgets: Widget[]) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [isDragging, setIsDragging] = useState(false);

  const addWidget = useCallback((widget: Widget) => {
    setWidgets((prev) => [...prev, widget]);
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const moveWidget = useCallback((id: string, x: number, y: number) => {
    setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, x, y } : w));
  }, []);

  const resizeWidget = useCallback((id: string, w: number, h: number) => {
    setWidgets((prev) => prev.map((widget) => widget.id === id ? { ...widget, w, h } : widget));
  }, []);

  const saveLayout = useCallback(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
  }, [widgets]);

  return { widgets, isDragging, setIsDragging, addWidget, removeWidget, moveWidget, resizeWidget, saveLayout };
}
