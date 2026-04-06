/**
 * Component Registry with Versioning — Tracks component metadata and version compatibility.
 *
 * Interview edge case: A consuming app upgrades the component library from v2 to v3,
 * but some components have breaking API changes. The registry must detect version
 * mismatches and provide migration warnings.
 */

export interface ComponentMetadata {
  name: string;
  version: string;
  a11yCompliant: boolean;
  tokensUsed: string[];
  deprecatedIn?: string;
  migrationGuide?: string;
}

/**
 * Singleton registry that tracks all registered components and their versions.
 */
export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentMetadata> = new Map();
  private currentVersion: string = '0.0.0';

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  register(metadata: ComponentMetadata): void {
    if (this.components.has(metadata.name)) {
      console.warn(`[ComponentRegistry] Component "${metadata.name}" already registered. Overwriting.`);
    }
    this.components.set(metadata.name, metadata);

    // Check for deprecation
    if (metadata.deprecatedIn) {
      console.warn(
        `[ComponentRegistry] "${metadata.name}" is deprecated since v${metadata.deprecatedIn}.` +
        (metadata.migrationGuide ? ` Migration guide: ${metadata.migrationGuide}` : ''),
      );
    }
  }

  getComponent(name: string): ComponentMetadata | undefined {
    return this.components.get(name);
  }

  getAllComponents(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  getAccessibilityReport(): { total: number; compliant: number; nonCompliant: string[] } {
    const all = this.getAllComponents();
    return {
      total: all.length,
      compliant: all.filter((c) => c.a11yCompliant).length,
      nonCompliant: all.filter((c) => !c.a11yCompliant).map((c) => c.name),
    };
  }

  setVersion(version: string): void {
    this.currentVersion = version;
  }

  getVersion(): string {
    return this.currentVersion;
  }
}
