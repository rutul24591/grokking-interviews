export type Issue = { field?: string; code: string; message: string };

export function stableIssueSort(a: Issue, b: Issue) {
  // deterministic ordering for stable UI and testing snapshots
  const fa = a.field ?? "";
  const fb = b.field ?? "";
  if (fa !== fb) return fa.localeCompare(fb);
  return a.code.localeCompare(b.code);
}

export function toUserMessage(issue: Issue, locale: string) {
  // In production, use i18n keys and templating, not raw strings.
  // The important part: `code` is stable, `message` is presentation.
  return `[${locale}] ${issue.message}`;
}

