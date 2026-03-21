In the context of Developer Experience (developer, experience), this example provides a focused implementation of the concept below.

In production you want error reports that are:
- easy to correlate (`requestId`),
- safe to display (redacted),
- and actionable (the `requestId` lets on-call find full logs).

This demo shows a minimal redaction + correlation ID pattern.

