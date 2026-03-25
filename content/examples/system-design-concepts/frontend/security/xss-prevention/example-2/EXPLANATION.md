## Why output encoding exists

If untrusted data is inserted into HTML, the browser can interpret it as markup or script.

Output encoding converts special characters into safe entities, so the browser treats the data as text.

Notes:
- Encoding is **contextual** (HTML text != attribute != JS != URL contexts).
- React does this by default for text nodes, but you still need discipline around “escape hatches”.

