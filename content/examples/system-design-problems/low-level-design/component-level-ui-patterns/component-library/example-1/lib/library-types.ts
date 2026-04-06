// ============================================================
// lib/library-types.ts
// Core TypeScript interfaces for the component library
// ============================================================

// ── Token Categories ────────────────────────────────────────

export type TokenCategory =
  | "color"
  | "typography"
  | "spacing"
  | "shadow"
  | "radius"
  | "zIndex";

// ── Design Token ────────────────────────────────────────────

export interface DesignToken {
  /** Unique token name, e.g. "color-primary" */
  name: string;
  /** Resolved value (hex, px, rem, shadow string, etc.) */
  value: string;
  /** Category this token belongs to */
  category: TokenCategory;
  /** Human-readable description of the token purpose */
  description: string;
  /**
   * Reference to another token name.
   * If set, this token is an alias and its value
   * should resolve to the referenced token's value.
   */
  alias?: string;
  /** Whether this token is deprecated */
  deprecated?: boolean;
  /** If deprecated, the token name that replaces it */
  replacement?: string;
}

// ── Theme Definition ────────────────────────────────────────

export interface ThemeDefinition {
  /** Unique theme identifier, e.g. "light", "dark", "brand-acme" */
  id: string;
  /** Human-readable theme name */
  name: string;
  /** Map of token name → resolved value for this theme */
  tokens: Record<string, string>;
  /** Warnings produced during theme build (e.g. contrast failures) */
  warnings: ThemeWarning[];
}

// ── Theme Warning ───────────────────────────────────────────

export interface ThemeWarning {
  /** Warning category */
  type: "contrast" | "validation" | "deprecation";
  /** Human-readable message */
  message: string;
  /** Token name(s) involved */
  tokens: string[];
  /** Severity level */
  severity: "critical" | "warning" | "info";
}

// ── Theme Override ──────────────────────────────────────────

/**
 * Partial map allowing consumers to customize any subset
 * of tokens without specifying the full theme.
 */
export type ThemeOverride = Partial<Record<string, string>>;

// ── Component Metadata ──────────────────────────────────────

export interface ComponentMeta {
  /** Component display name, e.g. "Button" */
  name: string;
  /** Semantic version, e.g. "2.1.0" */
  version: string;
  /** Accessibility audit status */
  a11yStatus: "pass" | "fail" | "pending" | "partial";
  /** Accessibility violation details (if a11yStatus is "fail" or "partial") */
  a11yViolations?: A11yViolation[];
  /** Component category for documentation grouping */
  category: string;
  /** Design tokens this component consumes */
  tokens: string[];
  /** Whether this component is deprecated */
  deprecated: boolean;
  /** If deprecated, migration guidance */
  deprecationInfo?: {
    since: string;
    removeIn: string;
    replacement: string;
    migrationGuide: string;
  };
  /** Short description for documentation listings */
  description: string;
}

// ── Accessibility Violation ─────────────────────────────────

export interface A11yViolation {
  /** axe-core rule ID */
  ruleId: string;
  /** Impact level */
  impact: "critical" | "serious" | "moderate" | "minor";
  /** CSS selector of the affected element */
  selector: string;
  /** Human-readable description of the issue */
  description: string;
  /** How to fix the issue */
  remediation: string;
}

// ── Polymorphic Component Props ─────────────────────────────

/**
 * Utility type for polymorphic "as" prop.
 * Allows a component to render as a different element
 * while preserving element-specific prop types.
 */
export type AsProp<T extends React.ElementType> = {
  as?: T;
};

export type ComponentPropsWithAs<
  T extends React.ElementType,
  P = object
> = P & AsProp<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof P | "as">;

// ── Component Variant ───────────────────────────────────────

export interface ComponentVariant {
  /** Variant name, e.g. "primary", "secondary" */
  name: string;
  /** CSS class or style override for this variant */
  className?: string;
  /** Tokens overridden for this variant */
  tokenOverrides?: Record<string, string>;
}

// ── Playground Control ──────────────────────────────────────

export interface PlaygroundControl {
  /** Prop name to control */
  prop: string;
  /** Control type in the playground UI */
  controlType: "select" | "text" | "number" | "boolean" | "color";
  /** Label shown in the playground UI */
  label: string;
  /** Available options (for select control type) */
  options?: string[];
  /** Default value */
  defaultValue: string | number | boolean;
}
