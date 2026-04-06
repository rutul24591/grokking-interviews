// ============================================================
// lib/component-registry.ts
// Component registration, metadata tracking, version tracking
// ============================================================

import type { ComponentMeta } from "./library-types";

// ── Registry Store ──────────────────────────────────────────

const registry = new Map<string, ComponentMeta>();

// ── Registration ────────────────────────────────────────────

/**
 * Register a component with its metadata.
 * Throws if a component with the same name is already registered
 * (prevents accidental duplicate registrations).
 */
export function registerComponent(meta: ComponentMeta): void {
  if (registry.has(meta.name)) {
    const existing = registry.get(meta.name)!;
    if (existing.version === meta.version) {
      // Silent skip for identical re-registration (e.g., HMR)
      return;
    }
    throw new Error(
      `Component "${meta.name}" v${existing.version} is already registered. ` +
      `Cannot register v ${meta.version}. Unregister first.`
    );
  }

  registry.set(meta.name, meta);
}

/**
 * Update an existing component's metadata.
 * Used for updating a11y status after an audit run.
 */
export function updateComponentMeta(
  name: string,
  updates: Partial<ComponentMeta>
): void {
  const existing = registry.get(name);
  if (!existing) {
    throw new Error(`Component "${name}" is not registered.`);
  }

  registry.set(name, { ...existing, ...updates });
}

// ── Lookup APIs ─────────────────────────────────────────────

/**
 * Get metadata for a specific component.
 */
export function getComponent(name: string): ComponentMeta | undefined {
  return registry.get(name);
}

/**
 * Get all registered components.
 */
export function getAllComponents(): ComponentMeta[] {
  return [...registry.values()];
}

/**
 * Get components filtered by category.
 */
export function getComponentsByCategory(category: string): ComponentMeta[] {
  return [...registry.values()].filter((c) => c.category === category);
}

/**
 * Get all deprecated components.
 */
export function getDeprecatedComponents(): ComponentMeta[] {
  return [...registry.values()].filter((c) => c.deprecated);
}

/**
 * Get components by accessibility status.
 */
export function getComponentsByA11yStatus(
  status: ComponentMeta["a11yStatus"]
): ComponentMeta[] {
  return [...registry.values()].filter((c) => c.a11yStatus === status);
}

/**
 * Get components that consume a specific design token.
 */
export function getComponentsUsingToken(tokenName: string): ComponentMeta[] {
  return [...registry.values()].filter((c) => c.tokens.includes(tokenName));
}

// ── Registration Helper ─────────────────────────────────────

/**
 * Higher-order function that registers a component and
 * returns the metadata for use in the component itself.
 *
 * Usage:
 *   const ButtonMeta = createComponentMeta({
 *     name: "Button",
 *     version: "2.1.0",
 *     ...
 *   });
 *
 *   export function Button(props: ButtonProps) { ... }
 *   Button.meta = ButtonMeta;
 */
export function createComponentMeta(
  meta: Omit<ComponentMeta, "deprecated" | "a11yStatus" | "a11yViolations"> &
    Partial<Pick<ComponentMeta, "deprecated" | "a11yStatus" | "a11yViolations">>
): ComponentMeta {
  const fullMeta: ComponentMeta = {
    ...meta,
    deprecated: meta.deprecated ?? false,
    a11yStatus: meta.a11yStatus ?? "pending",
  };

  registerComponent(fullMeta);
  return fullMeta;
}

// ── Development-only Diagnostics ────────────────────────────

/**
 * Print a summary of the registry to the console.
 * Only runs in development mode.
 */
export function printRegistrySummary(): void {
  if (process.env.NODE_ENV !== "development") return;

  const components = getAllComponents();
  const total = components.length;
  const pass = components.filter((c) => c.a11yStatus === "pass").length;
  const fail = components.filter((c) => c.a11yStatus === "fail").length;
  const pending = components.filter((c) => c.a11yStatus === "pending").length;
  const deprecated = getDeprecatedComponents().length;

  console.group("Component Library Registry");
  console.log(`Total components: ${total}`);
  console.log(`Accessibility: ${pass} pass, ${fail} fail, ${pending} pending`);
  console.log(`Deprecated: ${deprecated}`);
  console.groupEnd();
}
