export type Position = { line: number; col: number }; // 0-based

export type TextBuffer = {
  lines: string[];
  version: number;
};

export function fromText(text: string): TextBuffer {
  return { lines: text.split(/\r?\n/), version: 1 };
}

export function insertText(buf: TextBuffer, pos: Position, text: string): TextBuffer {
  const lines = buf.lines.slice();
  const line = lines[pos.line] ?? "";
  const before = line.slice(0, pos.col);
  const after = line.slice(pos.col);
  const insertLines = text.split(/\r?\n/);
  if (insertLines.length === 1) {
    lines[pos.line] = before + insertLines[0] + after;
  } else {
    const first = before + insertLines[0];
    const last = insertLines[insertLines.length - 1] + after;
    const middle = insertLines.slice(1, -1);
    lines.splice(pos.line, 1, first, ...middle, last);
  }
  return { lines, version: buf.version + 1 };
}

