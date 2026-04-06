// BreadcrumbItem represents a single entry in the breadcrumb trail.
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
  isEllipsis?: boolean;
  hiddenItems?: BreadcrumbItem[];
}

// SeparatorType defines the available separator styles.
export type SeparatorType = "slash" | "chevron" | "custom";

// TruncationConfig controls how long breadcrumb trails are collapsed.
export interface TruncationConfig {
  visibleLimit: number;
  keepFirst: number;
  keepLast: number;
}

// BreadcrumbConfig is the full configuration object passed to the breadcrumb system.
export interface BreadcrumbConfig {
  labelOverrides: Map<string, string>;
  separator: SeparatorType | React.ReactNode;
  truncation: TruncationConfig;
  mobileBreakpoint: number;
  baseUrl: string;
  idResolver?: (segment: string) => string | null;
}

// Default configuration values.
export const DEFAULT_TRUNCATION: TruncationConfig = {
  visibleLimit: 5,
  keepFirst: 2,
  keepLast: 2,
};

export const DEFAULT_MOBILE_BREAKPOINT = 640;

export const DEFAULT_BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://example.com";

// Default config with sensible values.
export const DEFAULT_CONFIG: BreadcrumbConfig = {
  labelOverrides: new Map(),
  separator: "chevron",
  truncation: DEFAULT_TRUNCATION,
  mobileBreakpoint: DEFAULT_MOBILE_BREAKPOINT,
  baseUrl: DEFAULT_BASE_URL,
};
