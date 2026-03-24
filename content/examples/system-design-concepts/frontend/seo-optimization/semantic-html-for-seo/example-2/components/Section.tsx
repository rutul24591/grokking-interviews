import { assertValidHeadingTree, type DocNode } from "@/lib/outline";

function slugToId(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Heading({ level, id, children }: { level: 2 | 3 | 4; id: string; children: string }) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={level === 2 ? "text-xl font-semibold" : "text-lg font-semibold"}>
      <a className="hover:underline" href={`#${id}`}>
        {children}
      </a>
    </Tag>
  );
}

export function Section({ node }: { node: DocNode }) {
  assertValidHeadingTree(node);
  const id = node.id ?? slugToId(node.title);

  return (
    <section aria-labelledby={id} className="mt-8">
      <Heading level={node.level} id={id}>
        {node.title}
      </Heading>
      <p className="mt-2 text-slate-200">{node.body}</p>

      {node.children?.map((child) => (
        <Section key={child.id ?? child.title} node={child} />
      ))}
    </section>
  );
}

