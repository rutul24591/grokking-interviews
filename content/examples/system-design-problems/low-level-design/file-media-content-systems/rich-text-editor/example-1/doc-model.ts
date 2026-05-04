export type NodeId = string;

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "mention"; userId: string; label: string }
  | { kind: "link"; href: string; children: Inline[] };

export type Block =
  | { kind: "paragraph"; id: NodeId; children: Inline[] }
  | { kind: "heading"; id: NodeId; level: 1 | 2 | 3; children: Inline[] }
  | { kind: "image"; id: NodeId; src: string; alt?: string };

export type Document = { version: number; blocks: Block[] };

