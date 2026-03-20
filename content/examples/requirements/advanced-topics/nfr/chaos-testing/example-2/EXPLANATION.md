This example focuses on the “make it safe” part of chaos testing: **guardrails** and **blast radius policy**.

In real organizations, the fastest path to “never allowed in prod” is running chaos experiments without:

- explicit constraints (max duration, max impact %, target allowlists)
- required approvals (human or automated)
- kill switches and audit trails

This runnable CLI demonstrates a simple but production-shaped approach:

1) Validate the experiment plan schema.
2) Evaluate it against an organization policy.
3) Produce a decision: allow/deny + reasons + required changes.

