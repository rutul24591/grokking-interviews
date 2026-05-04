# Rich Text Editor — Full Implementation (Document Model + Ops)

Example 1 implements the core of a rich text editor:

- Document model (blocks + inlines)
- Cursor/selection model (simplified)
- Operation model (insert text, delete range, split blocks)
- Mention tokens and image nodes
- Hooks for collaborative editing (op log surface)

Interview focus:
- Why you need an op-based model for collaboration (OT/CRDT)
- Input method edge cases (IME composition)

