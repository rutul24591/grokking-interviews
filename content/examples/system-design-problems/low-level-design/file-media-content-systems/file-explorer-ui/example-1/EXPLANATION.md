# File Explorer UI — Full Implementation (Model + Ops)

Example 1 implements the core model for a file explorer:

- Tree + list view model (folder navigation)
- Search/filter within current folder and across tree
- Bulk operations model (select, move, delete) with optimistic hooks
- Context menu action model and permission checks hook

Interview focus:
- Representing large folders (pagination + virtualization)
- Preventing cycles on move and handling concurrent changes

