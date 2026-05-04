export type MdBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "code"; lang: string | null; text: string };

export type ParserState = {
  blocks: MdBlock[];
  buffer: string;
  inCodeFence: boolean;
  fenceLang: string | null;
};

export function createParser(): ParserState {
  return { blocks: [], buffer: "", inCodeFence: false, fenceLang: null };
}

function flushParagraph(state: ParserState) {
  const text = state.buffer.trimEnd();
  state.buffer = "";
  if (text.trim()) state.blocks.push({ kind: "paragraph", text });
}

function flushCode(state: ParserState) {
  const text = state.buffer;
  state.buffer = "";
  state.blocks.push({ kind: "code", lang: state.fenceLang, text });
}

export function ingest(state: ParserState, chunk: string): ParserState {
  const next: ParserState = { ...state, blocks: state.blocks.slice(), buffer: state.buffer };
  const lines = chunk.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fence = /^```(.*)$/.exec(line);
    if (fence) {
      if (!next.inCodeFence) {
        flushParagraph(next);
        next.inCodeFence = true;
        next.fenceLang = fence[1]?.trim() || null;
      } else {
        flushCode(next);
        next.inCodeFence = false;
        next.fenceLang = null;
      }
      continue;
    }

    next.buffer += line + (i === lines.length - 1 ? "" : "\n");
    if (!next.inCodeFence && line.trim() === "") {
      flushParagraph(next);
    }
  }

  return next;
}

