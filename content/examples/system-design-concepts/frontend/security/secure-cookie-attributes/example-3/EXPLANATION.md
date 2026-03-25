## Why scoping matters

If you scope cookies too broadly (Domain, Path) you can:
- accidentally send sensitive cookies to unintended paths/subdomains
- create conflicts where different paths set the same cookie name

Mitigations:
- prefer host-only cookies (no Domain)
- use `Path=/` for session cookies (plus `__Host-` when possible)
- separate cookie names for different scopes

