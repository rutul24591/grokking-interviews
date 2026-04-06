export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json' | 'markdown';
export interface EditorState {
  content: string;
  language: CodeLanguage;
  cursorLine: number;
  cursorCol: number;
  selections: { start: number; end: number }[];
}
export interface EditorConfig {
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
}
