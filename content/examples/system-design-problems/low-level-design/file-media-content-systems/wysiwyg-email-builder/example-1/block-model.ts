export type BlockId = string;

export type Block =
  | { kind: "text"; id: BlockId; html: string }
  | { kind: "image"; id: BlockId; src: string; alt?: string }
  | { kind: "button"; id: BlockId; label: string; href: string }
  | { kind: "divider"; id: BlockId }
  | { kind: "spacer"; id: BlockId; heightPx: number };

export type Column = { id: string; blocks: Block[]; widthPct: number };
export type Row = { id: string; columns: Column[] };

export type EmailDoc = { version: number; rows: Row[]; variables: string[] };

export function insertVariable(html: string, variable: string) {
  return html + `{{${variable}}}`;
}

