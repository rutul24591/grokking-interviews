const md = `# Title

## Overview
TODO

## Ownership
- Team: platform
`;

const findings: string[] = [];
if (md.includes("TODO")) findings.push("Contains TODO placeholder");
if (!/^##\s+Ownership/m.test(md)) findings.push("Missing Ownership section");

console.log({ ok: findings.length === 0, findings });
if (findings.length) process.exit(1);

