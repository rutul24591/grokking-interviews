// ============================================================
// content-model.ts — Document model (blocks, inlines, leaves)
// with serialization to HTML, JSON, and Markdown.
// ============================================================

import type {
  BlockNode,
  TextLeaf,
  InlineNode,
  DocumentModel,
  EditorNode,
} from "./editor-types";

// ── Serialization to JSON ───────────────────────────────────

export function serializeToJSON(doc: DocumentModel): string {
  return JSON.stringify(doc, null, 2);
}

export function deserializeFromJSON(json: string): DocumentModel {
  return JSON.parse(json);
}

// ── Serialization to HTML ───────────────────────────────────

export function serializeToHTML(doc: DocumentModel): string {
  return doc.root.map(blockToHTML).join("\n");
}

function blockToHTML(block: BlockNode): string {
  const childrenHTML = block.children.map(nodeToHTML).join("");

  switch (block.type) {
    case "paragraph":
      return `<p>${childrenHTML}</p>`;
    case "heading":
      const level = block.level ?? 1;
      return `<h${level}>${childrenHTML}</h${level}>`;
    case "list-item":
      return `<li>${childrenHTML}</li>`;
    case "ordered-list-item":
      return `<li>${childrenHTML}</li>`;
    case "code-block":
      return `<pre><code>${escapeHTML(childrenHTML)}</code></pre>`;
    case "image":
      if (block.imageStatus === "complete" && block.imageUrl) {
        const alt = block.children
          .filter((c): c is TextLeaf => c.type === "text")
          .map((c) => c.text)
          .join("");
        return `<figure><img src="${escapeAttr(block.imageUrl)}" alt="${escapeAttr(alt)}" /></figure>`;
      }
      return `<div data-image-placeholder="${block.imageId}">Uploading...</div>`;
    default:
      return `<p>${childrenHTML}</p>`;
  }
}

function nodeToHTML(node: TextLeaf | InlineNode): string {
  if (node.type === "text") {
    return textLeafToHTML(node);
  }

  // Inline nodes
  if (node.type === "link" && node.url) {
    const inner = node.children.map(nodeToHTML).join("");
    return `<a href="${escapeAttr(node.url)}">${inner}</a>`;
  }

  if (node.type === "mention" && node.userName) {
    return `<span data-mention="${escapeAttr(node.userId ?? "")}" class="mention">@${escapeAttr(node.userName)}</span>`;
  }

  return node.children.map(nodeToHTML).join("");
}

function textLeafToHTML(leaf: TextLeaf): string {
  let text = escapeHTML(leaf.text);

  // Apply marks in reverse order so innermost is applied first
  const marks = [...leaf.marks].reverse();
  for (const mark of marks) {
    switch (mark) {
      case "bold":
        text = `<strong>${text}</strong>`;
        break;
      case "italic":
        text = `<em>${text}</em>`;
        break;
      case "underline":
        text = `<u>${text}</u>`;
        break;
      case "code":
        text = `<code>${text}</code>`;
        break;
    }
  }

  return text;
}

// ── Serialization to Markdown ───────────────────────────────

export function serializeToMarkdown(doc: DocumentModel): string {
  return doc.root.map(blockToMarkdown).join("\n\n");
}

function blockToMarkdown(block: BlockNode): string {
  const childrenText = block.children.map(nodeToMarkdown).join("");

  switch (block.type) {
    case "paragraph":
      return childrenText;
    case "heading":
      const level = block.level ?? 1;
      const prefix = "#".repeat(Math.min(level, 6));
      return `${prefix} ${childrenText}`;
    case "list-item":
      return `- ${childrenText}`;
    case "ordered-list-item":
      // Note: proper numbering requires tracking index; simplified here
      return `1. ${childrenText}`;
    case "code-block":
      return "```\n" + childrenText + "\n```";
    case "image":
      if (block.imageStatus === "complete" && block.imageUrl) {
        const alt = block.children
          .filter((c): c is TextLeaf => c.type === "text")
          .map((c) => c.text)
          .join("");
        return `![${alt}](${block.imageUrl})`;
      }
      return `![Uploading...](${block.imageId})`;
    default:
      return childrenText;
  }
}

function nodeToMarkdown(node: TextLeaf | InlineNode): string {
  if (node.type === "text") {
    return textLeafToMarkdown(node);
  }

  if (node.type === "link" && node.url) {
    const inner = node.children.map(nodeToMarkdown).join("");
    return `[${inner}](${node.url})`;
  }

  if (node.type === "mention" && node.userName) {
    return `@${node.userName}`;
  }

  return node.children.map(nodeToMarkdown).join("");
}

function textLeafToMarkdown(leaf: TextLeaf): string {
  let text = leaf.text;

  const marks = [...leaf.marks].reverse();
  for (const mark of marks) {
    switch (mark) {
      case "bold":
        text = `**${text}**`;
        break;
      case "italic":
        text = `*${text}*`;
        break;
      case "underline":
        // Markdown has no native underline; use HTML
        text = `<u>${text}</u>`;
        break;
      case "code":
        text = `\`${text}\``;
        break;
    }
  }

  return text;
}

// ── Utility Functions ───────────────────────────────────────

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Document Model Operations ───────────────────────────────

export function createParagraphBlock(text = ""): BlockNode {
  return {
    id: crypto.randomUUID(),
    type: "paragraph",
    children: [{ type: "text", text, marks: [] }],
  };
}

export function createHeadingBlock(level: number, text = ""): BlockNode {
  return {
    id: crypto.randomUUID(),
    type: "heading",
    level,
    children: [{ type: "text", text, marks: [] }],
  };
}

export function createCodeBlock(text = ""): BlockNode {
  return {
    id: crypto.randomUUID(),
    type: "code-block",
    children: [{ type: "text", text, marks: [] }],
  };
}

export function createImageBlock(
  imageId: string,
  fileId?: string
): BlockNode {
  return {
    id: crypto.randomUUID(),
    type: "image",
    imageId,
    imageStatus: "pending",
    imageProgress: 0,
    children: [{ type: "text", text: fileId ?? "", marks: [] }],
  };
}

export function createMentionInline(
  userId: string,
  userName: string
): InlineNode {
  return {
    type: "mention",
    userId,
    userName,
    children: [{ type: "text", text: `@${userName}`, marks: [] }],
  };
}

export function createLinkInline(
  url: string,
  text: string
): InlineNode {
  return {
    type: "link",
    url,
    children: [{ type: "text", text, marks: [] }],
  };
}
