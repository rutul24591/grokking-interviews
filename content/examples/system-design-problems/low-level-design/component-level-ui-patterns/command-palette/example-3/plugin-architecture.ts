/**
 * Command Palette — Staff-Level Plugin Architecture.
 *
 * Staff differentiator: Runtime plugin registration with type-safe command
 * definitions, lazy-loaded command descriptions, and permission-based
 * command filtering.
 */

export interface CommandDefinition<T = unknown> {
  id: string;
  label: string;
  keywords?: string[];
  icon?: React.ReactNode;
  shortcut?: string;
  group: string;
  execute: (payload?: T) => void | Promise<void>;
  isVisible?: () => boolean; // Permission-based visibility
  loadDescription?: () => Promise<string>; // Lazy-loaded description
}

/**
 * Plugin-based command registry with lazy loading and permission filtering.
 */
export class PluginCommandRegistry {
  private commands: Map<string, CommandDefinition> = new Map();
  private plugins: Map<string, { register: () => void; unregister: () => void }> = new Map();

  /**
   * Registers a command definition.
   */
  registerCommand(cmd: CommandDefinition): void {
    if (this.commands.has(cmd.id)) {
      console.warn(`Command "${cmd.id}" already registered`);
    }
    this.commands.set(cmd.id, cmd);
  }

  /**
   * Registers a plugin that can add multiple commands.
   */
  registerPlugin(pluginId: string, plugin: { register: () => void; unregister: () => void }): void {
    if (this.plugins.has(pluginId)) {
      console.warn(`Plugin "${pluginId}" already registered`);
    }
    this.plugins.set(pluginId, plugin);
    plugin.register();
  }

  /**
   * Unregisters a plugin and all its commands.
   */
  unregisterPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.unregister();
      this.plugins.delete(pluginId);
    }
  }

  /**
   * Returns all visible commands (filtered by isVisible check).
   */
  getVisibleCommands(): CommandDefinition[] {
    return Array.from(this.commands.values()).filter(
      (cmd) => !cmd.isVisible || cmd.isVisible(),
    );
  }

  /**
   * Executes a command by ID.
   */
  async executeCommand(id: string, payload?: unknown): Promise<void> {
    const cmd = this.commands.get(id);
    if (!cmd) throw new Error(`Command "${id}" not found`);
    await cmd.execute(payload);
  }

  /**
   * Returns all registered commands grouped by their group property.
   */
  getGroupedCommands(): Record<string, CommandDefinition[]> {
    const groups: Record<string, CommandDefinition[]> = {};
    for (const cmd of this.getVisibleCommands()) {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    }
    return groups;
  }
}
