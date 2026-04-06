// Tooltip Type Definitions

export type TooltipPlacement =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end"
  | "left-start"
  | "left-center"
  | "left-end"
  | "right-start"
  | "right-center"
  | "right-end";

export type TooltipContentType = "text" | "rich" | "image" | "shortcut";

export interface TooltipRichContent {
  title: string;
  description: string;
  imageUrl?: string;
  keyboardShortcut?: string;
}

export type TooltipContentData = string | React.ReactNode | TooltipRichContent;

export interface TooltipConfig {
  placement: TooltipPlacement;
  showDelay: number;
  hideDelay: number;
  arrow: boolean;
  contentType: TooltipContentType;
  disabled: boolean;
  followCursor: boolean;
  dismissOnScroll: boolean;
}

export interface TooltipArrowPosition {
  top: number;
  left: number;
  rotation: number;
}

export interface TooltipPosition {
  top: number;
  left: number;
  resolvedPlacement: TooltipPlacement;
  arrow: TooltipArrowPosition;
}

export interface TooltipState {
  id: string;
  triggerRect: DOMRect | null;
  content: TooltipContentData;
  config: TooltipConfig;
  computedPosition: TooltipPosition | null;
}

export interface TooltipStoreState {
  activeTooltip: TooltipState | null;
  isVisible: boolean;
  pendingShow: string | null;
}

export const DEFAULT_TOOLTIP_CONFIG: TooltipConfig = {
  placement: "top-center",
  showDelay: 300,
  hideDelay: 100,
  arrow: true,
  contentType: "text",
  disabled: false,
  followCursor: false,
  dismissOnScroll: true,
};
