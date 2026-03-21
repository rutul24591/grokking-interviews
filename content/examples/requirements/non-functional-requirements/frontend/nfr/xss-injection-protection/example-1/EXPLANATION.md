# XSS protection as an NFR

XSS is an org-scale risk because it:
- compromises user sessions,
- enables data exfiltration,
- and turns UI bugs into security incidents.

This example uses the safest default: don’t render user HTML. Instead, parse into a limited set of tokens and render as React nodes.

