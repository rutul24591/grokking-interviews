export type NodeType = 'file' | 'folder';

export interface NodeMetadata {
  size?: number; // bytes
  extension?: string;
  modifiedAt?: string; // ISO date
}

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  children: string[]; // child node IDs
  isExpanded: boolean;
  isLoading: boolean;
  isLoaded: boolean; // children have been fetched
  isSelected: boolean;
  metadata?: NodeMetadata;
}

export interface SelectionState {
  selectedIds: Set<string>;
  lastSelectedId: string | null;
  mode: 'single' | 'multi';
}

export type TreeAction =
  | { type: 'EXPAND_NODE'; id: string }
  | { type: 'COLLAPSE_NODE'; id: string }
  | { type: 'SELECT_NODE'; id: string; multi: boolean; range: boolean }
  | { type: 'DESELECT_NODE'; id: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'MOVE_NODE'; sourceId: string; targetParentId: string }
  | { type: 'COPY_NODE'; sourceId: string; targetParentId: string }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'RENAME_NODE'; id: string; newName: string }
  | { type: 'ADD_CHILDREN'; parentId: string; children: TreeNode[] }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_LOADING'; id: string; loading: boolean };

export type ContextMenuAction =
  | 'rename'
  | 'delete'
  | 'move'
  | 'copy'
  | 'paste'
  | 'newFolder'
  | 'newFile';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  nodeId: string | null;
}

export const FILE_ICONS: Record<string, string> = {
  ts: '📄',
  tsx: '⚛️',
  js: '📄',
  jsx: '⚛️',
  css: '🎨',
  scss: '🎨',
  json: '📋',
  md: '📝',
  png: '🖼️',
  jpg: '🖼️',
  svg: '🖼️',
  pdf: '📕',
  txt: '📄',
  html: '🌐',
};

export const FOLDER_OPEN_ICON = '📂';
export const FOLDER_CLOSED_ICON = '📁';
