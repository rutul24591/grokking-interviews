export type SplitPaneOrientation = 'horizontal' | 'vertical';

export interface PaneConfig {
  minSize: number;
  maxSize: number;
  initialSize?: number;
}

export interface SplitPaneProps {
  orientation?: SplitPaneOrientation;
  firstPane: PaneConfig;
  secondPane: PaneConfig;
  persistenceKey?: string;
  onResize?: (position: number) => void;
  children: [React.ReactNode, React.ReactNode];
}

export interface SplitPaneState {
  dividerPosition: number;
  isDragging: boolean;
  isCollapsed: boolean;
  previousPosition: number;
  containerSize: number;
}
