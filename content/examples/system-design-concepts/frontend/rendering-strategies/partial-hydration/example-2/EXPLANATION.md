Example 2 focuses on a practical optimization for partial hydration:

> Keep heavy interactive widgets out of the initial hydration path.

It uses `next/dynamic` to load a “heavy editor” only when the user opens it:
- the article shell stays server-rendered
- the editor island is code-split and client-only (`ssr: false`)

This is useful for:
- WYSIWYG editors
- charts
- code sandboxes
- any widget that’s expensive to parse/execute on initial load

