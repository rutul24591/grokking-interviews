export type WidgetType = 'line-chart' | 'bar-chart' | 'metric-card' | 'table' | 'pie-chart';
export interface Widget { id: string; type: WidgetType; x: number; y: number; w: number; h: number; config: Record<string, unknown>; }
export interface DashboardState { widgets: Widget[]; isDragging: boolean; }
export interface DashboardActions {
  addWidget: (w: Widget) => void;
  removeWidget: (id: string) => void;
  moveWidget: (id: string, x: number, y: number) => void;
  resizeWidget: (id: string, w: number, h: number) => void;
  saveLayout: () => void;
  loadLayout: (widgets: Widget[]) => void;
}
