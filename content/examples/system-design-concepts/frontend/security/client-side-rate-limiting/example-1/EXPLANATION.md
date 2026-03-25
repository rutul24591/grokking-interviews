## Why client-side limiting exists

Client-side limiting:
- improves UX (prevents accidental spamming)
- reduces backend load from “honest” clients

It is **not** a security boundary:
- attackers can bypass it (custom clients, modified JS)
- multiple tabs/devices can multiply rate

Treat it as a UX + cost optimization; keep server-side rate limits as the source of truth.

