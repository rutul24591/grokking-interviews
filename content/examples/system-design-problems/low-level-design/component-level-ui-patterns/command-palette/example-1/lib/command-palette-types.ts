export type CommandGroup = 'Navigation' | 'Actions' | 'Content' | 'Recent';

export interface Command<T = unknown> {
  id: string;
  label: string;
  keywords?: string[];
  icon?: React.ReactNode;
  group: CommandGroup;
  execute: (payload?: T) => void;
  shortcut?: string;
  payload?: T;
}

export interface CommandResult extends Command {
  score: number;
}

export interface PluginRegistration {
  unregister: () => void;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  highlightIndex: number;
  results: CommandResult[];
  isLoading: boolean;
  recentCommands: Command[];
}
