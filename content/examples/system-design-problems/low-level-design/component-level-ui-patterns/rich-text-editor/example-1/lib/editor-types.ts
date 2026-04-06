// ============================================================
// editor-types.ts — Core TypeScript interfaces for the rich
// text editor document model, toolbar actions, mentions, and
// image data.
// ============================================================

// ── Node Types ──────────────────────────────────────────────

export type BlockType =
  | "paragraph"
  | "heading"
  | "list-item"
  | "ordered-list-item"
  | "code-block"
  | "image";

export type InlineType = "link" | "mention";

export type FormatMark = "bold" | "italic" | "underline" | "code";

export interface TextLeaf {
  type: "text";
  text: string;
  marks: FormatMark[];
}

export interface InlineNode {
  type: InlineType;
  children: TextLeaf[];
  // Link-specific
  url?: string;
  // Mention-specific
  userId?: string;
  userName?: string;
}

export interface BlockNode {
  type: BlockType;
  children: (TextLeaf | InlineNode)[];
  // Heading level (1–4), only for type === "heading"
  level?: number;
  // Image metadata, only for type === "image"
  imageId?: string;
  imageUrl?: string;
  imageStatus?: "pending" | "uploading" | "complete" | "failed";
  imageProgress?: number;
  imageError?: string;
}

export type EditorNode = BlockNode | InlineNode | TextLeaf;

// ── Document Model ──────────────────────────────────────────

export interface DocumentModel {
  root: BlockNode[];
}

// ── Selection State ─────────────────────────────────────────

export interface SelectionState {
  anchorBlockId: string | null;
  anchorOffset: number;
  focusBlockId: string | null;
  focusOffset: number;
  isCollapsed: boolean;
}

// ── Editor State ────────────────────────────────────────────

export interface EditorState {
  document: DocumentModel;
  selection: SelectionState;
  activeFormats: FormatMark[];
  activeBlockType: BlockType | null;
  history: DocumentModel[];
  historyIndex: number;
  isDirty: boolean;
}

// ── Toolbar Actions ─────────────────────────────────────────

export type ToolbarAction =
  | { type: "TOGGLE_BOLD" }
  | { type: "TOGGLE_ITALIC" }
  | { type: "TOGGLE_UNDERLINE" }
  | { type: "SET_HEADING"; level: number | null }
  | { type: "TOGGLE_ORDERED_LIST" }
  | { type: "TOGGLE_UNORDERED_LIST" }
  | { type: "INSERT_LINK"; url: string }
  | { type: "TOGGLE_CODE_BLOCK" }
  | { type: "TOGGLE_INLINE_CODE" }
  | { type: "UNDO" }
  | { type: "REDO" };

// ── Mention Data ────────────────────────────────────────────

export interface MentionData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface MentionState {
  query: string;
  results: MentionData[];
  selectedIndex: number;
  position: { top: number; left: number } | null;
  isOpen: boolean;
}

// ── Image Data ──────────────────────────────────────────────

export interface ImageData {
  id: string;
  file: File | null;
  url: string | null;
  status: "pending" | "uploading" | "complete" | "failed";
  progress: number;
  error?: string;
  blockId: string;
}

// ── Editor Config ───────────────────────────────────────────

export interface EditorConfig {
  historyLimit: number;
  debounceMs: number;
  uploadEndpoint: string;
  maxImageSize: number; // bytes
  allowedImageTypes: string[];
  mentionableUsers: MentionData[];
  collaborative?: boolean;
  onRemoteOperation?: (operation: unknown) => void;
  onPresenceUpdate?: (cursors: RemoteCursor[]) => void;
}

// ── Collaborative Editing Types ─────────────────────────────

export interface RemoteCursor {
  userId: string;
  userName: string;
  color: string;
  blockId: string | null;
  offset: number;
}
