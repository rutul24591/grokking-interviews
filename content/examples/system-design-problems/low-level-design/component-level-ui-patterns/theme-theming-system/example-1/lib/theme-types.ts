// Theme type definitions for the theming system

/** Valid built-in theme identifiers */
export type BuiltInThemeId = "light" | "dark";

/** Extensible theme identifier — includes built-in and custom themes */
export type ThemeId = BuiltInThemeId | string;

/** User's theme selection mode */
export type ThemeMode = "light" | "dark" | "system";

/** A single color token value (hex string or CSS color function) */
export type ColorToken = string;

/** Semantic color role identifiers */
export type ColorRole =
  | "bg-primary"
  | "bg-surface"
  | "bg-surface-elevated"
  | "text-primary"
  | "text-secondary"
  | "text-muted"
  | "text-on-primary"
  | "border-default"
  | "border-strong"
  | "color-primary"
  | "color-primary-hover"
  | "color-primary-active"
  | "color-success"
  | "color-warning"
  | "color-error"
  | "color-info";

/** Map of semantic color roles to their color values */
export interface ColorPalette {
  "bg-primary": ColorToken;
  "bg-surface": ColorToken;
  "bg-surface-elevated": ColorToken;
  "text-primary": ColorToken;
  "text-secondary": ColorToken;
  "text-muted": ColorToken;
  "text-on-primary": ColorToken;
  "border-default": ColorToken;
  "border-strong": ColorToken;
  "color-primary": ColorToken;
  "color-primary-hover": ColorToken;
  "color-primary-active": ColorToken;
  "color-success": ColorToken;
  "color-warning": ColorToken;
  "color-error": ColorToken;
  "color-info": ColorToken;
}

/** Typography scale definition */
export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string | number;
}

/** Named typography scale entries */
export interface TypographyScale {
  body: TypographyToken;
  bodySmall: TypographyToken;
  heading1: TypographyToken;
  heading2: TypographyToken;
  heading3: TypographyToken;
  code: TypographyToken;
}

/** Spacing scale (base 4px unit) */
export interface SpacingScale {
  xxs: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
}

/** Shadow definition (CSS box-shadow value) */
export interface ShadowToken {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/** Border radius definition */
export interface RadiusToken {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/** A generic design token with name, value, and category */
export interface ThemeToken {
  name: string;
  value: string;
  category: "color" | "typography" | "spacing" | "shadow" | "radius";
}

/** Complete theme configuration combining all token categories */
export interface ThemeConfig {
  id: ThemeId;
  name: string;
  palette: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  shadows: ShadowToken;
  radii: RadiusToken;
}

/** Registry of all available themes keyed by theme ID */
export type ThemeRegistry = Record<ThemeId, ThemeConfig>;
