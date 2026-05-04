import type { Document, Inline } from "./doc-model";

export type Path = { blockIndex: number; inlineIndex?: number; offset?: number };

export type Op =
  | { kind: "insertText"; at: Path; text: string }
  | { kind: "deleteText"; at: Path; count: number }
  | { kind: "insertInline"; at: Path; node: Inline }
  | { kind: "splitBlock"; blockIndex: number; atOffset: number };

export function apply(doc: Document, op: Op): Document {
  const blocks = doc.blocks.slice();
  const b = blocks[op.kind === "splitBlock" ? op.blockIndex : op.at.blockIndex];
  if (!b || b.kind === "image") return doc;

  if (op.kind === "insertText") {
    const i = op.at.inlineIndex ?? 0;
    const child = b.children[i];
    if (!child || child.kind !== "text") return doc;
    const off = op.at.offset ?? child.text.length;
    const next = {
      ...b,
      children: b.children.map((c, idx) =>
        idx === i && c.kind === "text"
          ? { kind: "text", text: c.text.slice(0, off) + op.text + c.text.slice(off) }
          : c,
      ),
    };
    blocks[op.at.blockIndex] = next;
    return { ...doc, version: doc.version + 1, blocks };
  }

  if (op.kind === "deleteText") {
    const i = op.at.inlineIndex ?? 0;
    const child = b.children[i];
    if (!child || child.kind !== "text") return doc;
    const off = op.at.offset ?? child.text.length;
    const next = {
      ...b,
      children: b.children.map((c, idx) =>
        idx === i && c.kind === "text"
          ? { kind: "text", text: c.text.slice(0, off) + c.text.slice(off + op.count) }
          : c,
      ),
    };
    blocks[op.at.blockIndex] = next;
    return { ...doc, version: doc.version + 1, blocks };
  }

  if (op.kind === "insertInline") {
    const i = op.at.inlineIndex ?? b.children.length;
    const next = { ...b, children: [...b.children.slice(0, i), op.node, ...b.children.slice(i)] };
    blocks[op.at.blockIndex] = next;
    return { ...doc, version: doc.version + 1, blocks };
  }

  if (op.kind === "splitBlock") {
    // split first paragraph text at offset into a new paragraph
    const firstInline = b.children[0];
    if (!firstInline || firstInline.kind !== "text") return doc;
    const left = firstInline.text.slice(0, op.atOffset);
    const right = firstInline.text.slice(op.atOffset);
    const leftBlock = { ...b, children: [{ kind: "text", text: left }] };
    const rightBlock = { kind: "paragraph" as const, id: `${b.id}-2`, children: [{ kind: "text", text: right }] };
    blocks.splice(op.blockIndex, 1, leftBlock, rightBlock);
    return { ...doc, version: doc.version + 1, blocks };
  }

  return doc;
}

