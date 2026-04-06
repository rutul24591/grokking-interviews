import type { Command, PluginRegistration } from './command-palette-types';

export class CommandRegistry {
  private commands = new Map<string, Command>();

  register(cmd: Command): PluginRegistration {
    if (this.commands.has(cmd.id)) {
      console.warn(`[CommandPalette] Duplicate command ID: ${cmd.id}. Overwriting.`);
    }
    this.commands.set(cmd.id, cmd);
    return { unregister: () => this.commands.delete(cmd.id) };
  }

  unregister(id: string) {
    this.commands.delete(id);
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }

  getByGroup(group: string): Command[] {
    return this.getAll().filter((c) => c.group === group);
  }
}

export const registry = new CommandRegistry();
