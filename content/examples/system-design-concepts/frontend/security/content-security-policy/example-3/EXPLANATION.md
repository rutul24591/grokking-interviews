## Why Report-Only matters

Strict CSP can break production if rolled out blindly.

Workflow:
1) deploy `Content-Security-Policy-Report-Only`
2) collect violation reports
3) tighten policy iteratively
4) switch to enforcing `Content-Security-Policy`

