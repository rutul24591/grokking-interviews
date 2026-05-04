export type UiNode =
  | { kind: "container"; id: string; children: UiNode[] }
  | { kind: "text"; id: string; value: string }
  | { kind: "input"; id: string; label: string; field: string };

export type GenerationResult = {
  tree: UiNode;
  rationale: string;
  risks: string[];
};

export function validateTree(node: UiNode): string[] {
  const errs: string[] = [];
  const visit = (n: UiNode) => {
    if (!n.id) errs.push("missing id");
    if (n.kind === "container") n.children.forEach(visit);
  };
  visit(node);
  return errs;
}
