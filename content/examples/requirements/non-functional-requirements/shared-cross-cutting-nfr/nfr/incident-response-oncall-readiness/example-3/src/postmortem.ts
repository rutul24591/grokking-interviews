export type Incident = {
  id: string;
  title: string;
  startedAt: string;
  resolvedAt: string;
  impact: string;
  timeline: Array<{ ts: string; note: string }>;
};

export function toMarkdown(inc: Incident) {
  return `# Postmortem: ${inc.title}

## Summary
- Incident ID: \`${inc.id}\`
- Start: ${inc.startedAt}
- Resolved: ${inc.resolvedAt}
- Impact: ${inc.impact}

## Timeline
${inc.timeline.map((t) => `- ${t.ts} — ${t.note}`).join("\n")}

## Root Cause
TBD

## Contributing Factors
TBD

## Action Items
- [ ] TBD
`;
}

