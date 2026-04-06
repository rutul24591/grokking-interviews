/**
 * WYSIWYG Email Builder — Staff-Level Template Versioning and Migration.
 *
 * Staff differentiator: Block schema versioning, backward-compatible template
 * migration, and email client compatibility testing pipeline.
 */

export interface TemplateVersion {
  version: string;
  blocks: EmailBlock[];
  metadata: TemplateMetadata;
}

export interface TemplateMetadata {
  name: string;
  createdAt: number;
  updatedAt: number;
  compatibility: {
    gmail: boolean;
    outlook: boolean;
    appleMail: boolean;
  };
}

export interface EmailBlock {
  type: string;
  config: Record<string, unknown>;
  schemaVersion: string;
}

/**
 * Manages template versioning and migration between schema versions.
 */
export class TemplateVersionManager {
  private migrations: Map<string, (template: any) => any> = new Map();

  /**
   * Registers a migration function from one schema version to the next.
   */
  registerMigration(fromVersion: string, toVersion: string, migrateFn: (template: any) => any): void {
    this.migrations.set(`${fromVersion}→${toVersion}`, migrateFn);
  }

  /**
   * Migrates a template to the target schema version.
   * Applies migrations sequentially through the version chain.
   */
  migrate(template: TemplateVersion, targetVersion: string): TemplateVersion {
    let current = { ...template };

    while (current.schemaVersion !== targetVersion) {
      const migrationKey = `${current.schemaVersion}→${targetVersion}`;
      const migrationFn = this.migrations.get(migrationKey);

      if (!migrationFn) {
        throw new Error(`No migration path from ${current.schemaVersion} to ${targetVersion}`);
      }

      current = migrationFn(current);
    }

    return current;
  }

  /**
   * Validates a template against the current schema.
   */
  validate(template: TemplateVersion): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const block of template.blocks) {
      if (!block.type) errors.push('Block missing type');
      if (!block.config) errors.push(`Block "${block.type}" missing config`);
      if (!block.schemaVersion) errors.push(`Block "${block.type}" missing schema version`);
    }

    return { valid: errors.length === 0, errors };
  }
}
