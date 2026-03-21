type Issue = { path: string; message: string };

function formatIssues(issues: Issue[]) {
  return issues.map((i) => `- ${i.path}: ${i.message}`).join("\n");
}

const issues: Issue[] = [
  { path: "publicBaseUrl", message: "Invalid url" },
  { path: "apiKey", message: "String must contain at least 10 character(s)" },
];

console.log(formatIssues(issues));
console.log(JSON.stringify({ ok: true }, null, 2));

