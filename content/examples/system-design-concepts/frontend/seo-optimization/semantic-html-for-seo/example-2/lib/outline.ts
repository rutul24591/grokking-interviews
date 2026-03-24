import { z } from "zod";

const DocNodeSchema: z.ZodType<DocNode> = z.lazy(() =>
  z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    body: z.string().min(1),
    level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    children: z.array(DocNodeSchema).optional()
  })
);

export type DocNode = {
  id?: string;
  title: string;
  body: string;
  level: 2 | 3 | 4;
  children?: DocNode[];
};

export type DocModel = {
  title: string;
  sections: DocNode[];
};

const DocModelSchema = z.object({
  title: z.string().min(1),
  sections: z.array(DocNodeSchema).min(1)
});

function slugToId(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function assertValidHeadingTree(node: DocNode) {
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      if (child.level <= node.level) {
        throw new Error(`Invalid heading nesting: h${child.level} under h${node.level} for "${node.title}"`);
      }
      if (child.level > node.level + 1) {
        throw new Error(`Invalid heading jump: h${node.level} → h${child.level} under "${node.title}"`);
      }
      assertValidHeadingTree(child);
    }
  }
}

export function buildToc(doc: DocModel): Array<{ id: string; title: string; level: 2 | 3 | 4 }> {
  const parsed = DocModelSchema.parse(doc);

  const out: Array<{ id: string; title: string; level: 2 | 3 | 4 }> = [];
  const visit = (n: DocNode) => {
    const id = n.id ?? slugToId(n.title);
    out.push({ id, title: n.title, level: n.level });
    n.children?.forEach(visit);
  };

  parsed.sections.forEach(visit);
  return out;
}
